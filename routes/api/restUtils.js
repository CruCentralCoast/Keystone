
module.exports = {

    search : function(model, req, res) {
        model.find(req.body.conditions, req.body.projection, req.body.options, function(err, item) {
           if (err) return res.send(err);
           return res.json(item);
        });
    },
    
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
            for (var iter = 0; iter < list.length; iter++) {
                selects[list[iter].replace('}', '').replace('{', '').replace(' ', '')] = true;
            }
        }

        model.find(data, selects).limit(lim).sort(order).exec(function(err, items) {
            if (err) return res.send(err);
            if (!items) return res.send('not found');

            return res.json(items);
        });
    },

    // used to get everything from a collection
    list : function(model, req, res) {
        model.find().exec(function(err, items) {
            if (err) return res.send(err);

            return res.status(200).json(items);
        });
    },

    // gets something by it's id
    get : function(model, req, res) {
    	model.findById(req.params.id).exec(function(err, item) {
    		if (err) return res.send(err);
            if (!item) return res.send('not found');
    	
            return res.status(200).json(item);
    	});
    },

    //creates something... such description!
    create : function(model, req, res) {
        model.create(req.body, function(err, item) {
    		if (err) return res.send(err);
    		return res.status(201).json(item);
    	});
    },

    //updates the model based on input
    update : function(model, req, res) {
        model.findById(req.body._id).exec(function(err, item) {
        
            if (err) return res.send(err);
            if (!item) return res.send('not found');
            
            var data = (req.method == 'POST') ? req.body : req.query;
            
            item.getUpdateHandler(req).process(data, function(err) {
                
                if (err) return res.send(err);
                
                return res.status(200).json(item);
            });
        
        });
    },    

    enumValues : function(model, req, res) {
        var path = model.schema.path(req.params.key);
        if (path.options)
        {
            return res.json(path.options.options);
        }
        else
            return res.json();
    }
}
