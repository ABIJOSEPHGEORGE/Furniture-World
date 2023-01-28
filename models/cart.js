module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    console.log(oldCart);
    this.add = function(item,id){
        var storedItem = this.items[id];
        
        if(!storedItem){
            storedItem = this.items[id] = {item:item,qty:0,price:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.sale_price*storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.sale_price;
    };
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}

