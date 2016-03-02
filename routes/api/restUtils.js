
function getRedact() {
    return {
        "$cond": {
            "if": {$ne: ["$requiresAuth", true]},
            "then": "$$DESCEND",
            "else": "$$PRUNE"
        }
    }
}

module.exports = {

    search : function(model, req, res) {
        if (!req.user) {
            req.body.conditions.requiresAuth = {$ne:true};
        }
        model.find(req.body.conditions, req.body.projection, req.body.options, function(err, item) {
           if (err) return res.apiError('database error', err);
           res.apiResponse(item);
        });
    },

    // used for queries
    find : function(model, req, res) {
        var data = (req.method == 'POST') ? req.body : req.query;
        
        var query = [
            {"$match":data}
        ];

        if (!req.user) {
            query.push({"$redact":getRedact()});
        }
        // default 0 means no limit
        if (req.query.limit) {
            query.push({"$limit":Number(req.query.limit)});
        }

        // default 0 means no limit
        //gets order by dymically creating the object specified
        if (req.query.order) {
            var order = {}; //null, means dont sort
            var parts = req.query.order.split(":");
            order[parts[0].replace('{', '')] = Number(parts[1].replace('}', '').replace(' ', ''));
            query.push({"$sort":order});
        }
        //creates select statements to only grab certain fields
        if (req.query.select) {
            var selects = {}; //default is an empty object, means grab all
            var list = req.query.select.split(",");
            for (var iter = 0; iter < list.length; iter++) {
                selects[list[iter].replace('}', '').replace('{', '').replace(' ', '')] = true;
            }
            console.log(selects);
            query.push({"$project":selects})
        }

        model.aggregate(query, function(err, items) {
            if (err) return res.apiError('database error', err);
            if (!items) return res.apiError('not found');

            res.apiResponse(items);
        });
    },

    // used to get everything from a collection
    list : function(model, req, res) {
        var query = {}
        if (!req.user) {
                query.requiresAuth = {$ne:true};
        }
        model.find(query).exec(function(err, items) {
            if (err) return res.apiError('database error', err);

            res.apiResponse(items);
        });
    },

    // gets something by it's id
    get : function(model, req, res) {
        var query = {_id:req.params.id};
        if (!req.user) {
            query.requiresAuth = {$ne:true};
        }

    	model.find(query).exec(function(err, items) {
    		if (err) return res.apiError('database error', err);
    		if (items.length == 0)
                return res.apiError('not found');
            else
    		    res.apiResponse(items[0]);
    	});
    },

    //creates something... such description!
    create : function(model, req, res) {
    	var item = new model,
    		data = (req.method == 'POST') ? req.body : req.query;

    	item.getUpdateHandler(req).process(data, function(err) {
    		if (err) return res.apiError('error', err);

    		res.apiResponse({
    			post: item
    		});
    	});
    },

    //updates the model based on input
    update : function(model, req, res) {
        model.findById(req.body._id).exec(function(err, item) {
        
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            
            var data = (req.method == 'POST') ? req.body : req.query;
            
            item.getUpdateHandler(req).process(data, function(err) {
                
                if (err) return res.apiError('create error', err);
                
                res.apiResponse({
                    post: item
                });
                
            });
        
        });
    },    

    enumValues : function(model, req, res) {
        var path = model.schema.path(req.params.key);
        if (path.options)
        {
            res.apiResponse(path.options.options);
        }
        else
            res.apiResponse();
    }
}
