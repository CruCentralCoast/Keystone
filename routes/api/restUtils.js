module.exports = {
    // used for queries
    find : function(model, req, res) {
        var data = (req.method == 'POST') ? req.body : req.query;

        // default 0 means no limit
        var lim = req.query.limit ? req.query.limit : 0;
        //gets order by dymically creating the object specified
        var order = {}; //null, means dont sort
        if (req.query.order) {
            var parts = req.query.order.split(":");
            order[parts[0].replace('{', '')] = parts[1].replace('}', '').replace(' ', '');
        }
        //creates select statements to only grab certain fields
        var selects = {}; //default is an empty object, means grab all
        if (req.query.select) {
            var list = req.query.select.split(",");
            console.log(list);
            for (var iter = 0; iter < list.length; iter++) {
                selects[list[iter].replace('}', '').replace('{', '').replace(' ', '')] = false;
            }
            console.log("selects statements are " + selects);
        }

        model.find(data, selects).limit(lim).sort(order).exec(function(err, items) {
            if (err) return res.apiError('database error', err);
            if (!items) return res.apiError('not found');

            res.apiResponse(items);
        });
    },

    // used to get everything from a collection
    list : function(model, req, res) {
        var query = model.find();
        query.exec(function(err, items) {
            if (err) return res.apiError('database error', err);

            res.apiResponse(items);
        });
    },

    // gets something by it's id
    get : function(model, req, res) {
    	model.findById(req.params.id).exec(function(err, item) {
    		if (err) return res.apiError('database error', err);
    		if (!item) return res.apiError('not found');

    		res.apiResponse(item);
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
    }
}