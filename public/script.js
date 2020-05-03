var LOAD_NUM  =4
var watcher
new Vue({
    el: "#app",
    data: {
        total: 1,
        products: [],
        cart: [],
        search: "cat",
        lastSearch: "",
        loading: false,
        results: []
    },
    methods: {
        addToCart: function(product){
            let found = false
            for(var i=0; i < this.cart.length; i++){
                if(this.cart[i].id === product.id){
                    found = true
                    this.cart[i].qty++;
                }
            }
            if(!found){
                this.cart.push({ title: product.title,
                                 price: product.price,
                                 id:  product.id,
                                 qty: 1
                               })
            }
            this.total += product.price
            
        },
        inc: function(item){
            item.qty++;
            this.total += item.price
        },
        dec: function(item){
            item.qty--;
            this.total -= item.price
            if(item.qty <= 0){
                var i = this.cart.indexOf(item)
                this.cart.splice(i,1)
            }
        },
        onSubmit: function(){
            this.loading = true
            this.products = []
            this.results = []
            const path = "/search?q=".concat(this.search)
            this.$http.get(path).then((response)=> {
                this.lastSearch = this.search
                this.appendResults()
                this.results = response.body    
                this.loading = false
            }).catch((error)=> {
                console.log("Error occured"+ error)
            })
        },
        appendResults: function(){
            if(this.products.length < this.results.length){
                var toAppend = this.results.slice(this.products.length, this.products.length+ LOAD_NUM)
                this.products =  this.products.concat(toAppend)
            }
        }
    },
    filters: {
        currency: function(price){
            return "$".concat(price.toFixed())
        }
    },
    created: function(){
        this.onSubmit()
    },
    updated: function(){
        var sensor = document.querySelector("#product-list-bottom")
        watcher = scrollMonitor.create(sensor)
        watcher.enterViewport(this.appendResults)
    },
    beforeUpdate: function(){
        if(watcher){
            watcher.destroy()
        }
        watcher = null
    },
});
