module.exports = function bestCharge(selectedItems) {
  var loadAllItems = require("../src/items");
  var loadPromotions=require("../src/promotions");
  var pricePromotion1=0,pricePromotion2=0;
 
  //#2
  function subStrCount(selectedItem){
    var count=selectedItem.substr(11,1);
    return Number(count);
  }
  //#3
  var allItems=loadAllItems();
  var selectedItemsList=[];
  for(var i=0;i<selectedItems.length;i++){
    var itemNum=selectedItems[i].substr(0,8);
    for(var j=0; j<allItems.length; j++){
      if(itemNum === allItems[j].id){
        selectedItemsList.push(allItems[j]);
        selectedItemsList[selectedItemsList.length-1].count=subStrCount(selectedItems[i]);
      }
    }
  }
//#4 the first and the second promoted summaries
var promotedType='no_promotion';
var Sum=0;
for(var i=0;i<selectedItemsList.length;i++){
  Sum+=(selectedItemsList[i].price*selectedItemsList[i].count);
}
if(Sum>=30){
  pricePromotion1=Sum-6;
  promotedType='yes_promotion';
}
var promotions=loadPromotions();
var promotedItems=promotions[1].items;//arry 优惠菜品
var flag=0;
var alreadyPromotedName=[];//本次优惠

for(var i=0;i<selectedItemsList.length;i++){
  flag=0;
  for(var j=0;j<promotedItems.length;j++){
    if(selectedItemsList[i].id===promotedItems[j]){
      flag=1;
      alreadyPromotedName.push(selectedItemsList[i].name);
      promotedType='yes_promotion';
      break;
    }
  }
  if(flag==0)
    pricePromotion2+=(selectedItemsList[i].price*selectedItemsList[i].count);
  else
    pricePromotion2+=((selectedItemsList[i].price*selectedItemsList[i].count)/2);
}
//#5 compare
var promotedPrice;
if(promotedType==='yes_promotion'){
  if(pricePromotion1<=pricePromotion2){
    promotedType=promotions[0].type;
    promotedPrice+=pricePromotion1;
  }
  else{
    promotedType=promotions[1].type;
    promotedPrice+=pricePromotion2;
  }
}
//#6 result
var summary='============= 订餐明细 =============';
for(var i=0;i<selectedItemsList.length;i++){
  summary=summary+'\n'+selectedItemsList[i].name+' x '+selectedItemsList[i].count+' = '+selectedItemsList[i].price*selectedItemsList[i].count+'元';
}
summary+='\n-----------------------------------\n';
if(promotedType==promotions[0].type){
  summary=summary+'使用优惠:\n'+promotedType;
  summary=summary+'，省6元\n-----------------------------------\n总计：'+pricePromotion1+'元';
}
else if(promotedType==promotions[1].type){
  summary=summary+'使用优惠:\n'+promotedType+'(';
  for(var i=0;i<alreadyPromotedName.length;i++){
    if(i==0)
      summary=summary+alreadyPromotedName[i];
    else
      summary=summary+'，'+alreadyPromotedName[i];
    if(i==alreadyPromotedName.length-1)
      summary+=')，';
  }
  summary=summary+'省'+(Sum-pricePromotion2)+'元\n-----------------------------------\n总计：'+pricePromotion2+'元';
}
else{
  summary=summary+'总计：'+Sum+'元';
}
summary+='\n===================================';
  return summary/*TODO*/;
}




