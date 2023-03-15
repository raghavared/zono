
//given details to process data
let inventory = {
    UK: {
        Mask: {
            quantity: 100,
            price: 65
        },
        Gloves: {
            quantity: 100,
            price: 100
        }
    },
    Germany: {
        Mask: {
            quantity: 100,
            price: 100
        },
        Gloves: {
            quantity: 50,
            price: 150
        }
    }
}
let shippingCostForEveryTenUnits = 400;
let discountForLocalCustomer = 0.2 //which is equal to 20%
// identification of passport UK :B3{0-9}2{A-Z}7{A-Z,0-9} regex to validate passport ^B[0-9]{3}[A-Z]{2}[A-Z,0-9]{7}$
// identification of passport Germany :A2{A-Z}9{A-Z,0-9} regex = ^A[A-Z]{2}[A-z,0-9]{9}




function process_order_details(inputData) {
    console.log(inputData);
    inputData = inputData.split(":");
    let country, passportNumber, item_1, item_1_quantity, item_2, item_2_quantity;
    if (inputData.length == 6) {
        country = inputData[0]
        passportNumber = inputData[1]
        item_1 = inputData[2]
        item_1_quantity = inputData[3]
        item_2 = inputData[4]
        item_2_quantity = inputData[5]
    } else {
        country = inputData[0]
        item_1 = inputData[1]
        item_1_quantity = inputData[2]
        item_2 = inputData[3]
        item_2_quantity = inputData[4]
        passportNumber = ''
    }

    // coutry pass prod and quantity 
    // return {country,passportNumber,order_items : [{item :item_1,quantity:item_1_quantity},{item:item_2,quantity:item_2_quantity}]}

    let orderDetails = { country, passportNumber, order_items: [{ item: item_1, quantity: item_1_quantity }, { item: item_2, quantity: item_2_quantity }] }
    // return if quantity greater than both of the coutries 
    if (item_1 == 'Mask' && parseInt(item_1_quantity) > (inventory.UK.Mask.quantity + inventory.Germany.Mask.quantity)) {
        return `OUT_OF_STOCK:${inventory.UK.Mask.quantity} : ${inventory.Germany.Mask.quantity} : ${inventory.UK.Gloves.quantity} : ${inventory.Germany.Gloves.quantity}`
    } else if (item_1 == 'Gloves' && parseInt(item_1_quantity) > (inventory.UK.Gloves.quantity + inventory.Germany.Gloves.quantity)) {
        return `OUT_OF_STOCK:${inventory.UK.Mask.quantity} : ${inventory.Germany.Mask.quantity} : ${inventory.UK.Gloves.quantity} : ${inventory.Germany.Gloves.quantity}`
    }

    let totalCost = 0;
    let transportCost = 0;

    //validate passport
    let passportCountry = passportNumber.startsWith("B") ? "UK" : passportNumber.startsWith("A") ? "Germany" : country;

    orderDetails.order_items.forEach(element => {

        if (element.quantity <= inventory[country][element.item].quantity && passportCountry == country) {
            totalCost += element.quantity * inventory[country][element.item].price;
            inventory[country][element.item].quantity -= element.quantity;
        } else {
            if (element.quantity > inventory[country][element.item].quantity) {
                let extra = element.quantity - inventory[country][element.item].quantity;
                totalCost += (element.quantity - extra) * inventory[country][element.item].price + extra * inventory[passportCountry][element.item].price;
                inventory[country][element.item].quantity -= (element.quantity - extra)
                inventory[passportCountry][element.item].quantity -= extra
                let cost = ((extra) / 10) * shippingCostForEveryTenUnits;
                transportCost += cost - (cost * discountForLocalCustomer)
            }
            if (passportCountry == "UK") {
                totalCost += (element.quantity - element.quantity % 10) * inventory[passportCountry][element.item].price + (element.quantity % 10) * inventory[country][element.item].price;
                inventory[passportCountry][element.item].quantity -= (element.quantity - element.quantity % 10);
                inventory[country][element.item].quantity -= element.quantity % 10;
                let cost = (element.quantity - element.quantity % 10) / 10 * shippingCostForEveryTenUnits;
                transportCost += cost - (cost * discountForLocalCustomer);
            } else {
                totalCost += element.quantity * inventory[country][element.item].price;
                inventory[country][element.item].quantity -= element.quantity;
            }
        }
    });
    return `${totalCost + transportCost} : ${inventory.UK.Mask.quantity} : ${inventory.Germany.Mask.quantity} : ${inventory.UK.Gloves.quantity} : ${inventory.Germany.Gloves.quantity}`
}

//output should be :: <total_sale_price>:<Mask_UK_inventory>:<Mask_Germany_inventory>:<Gloves_UK_inventory>:<Gloves_Germany_inventory>


let input = "UK:Gloves:250:Mask: 150"  // output = OUT_OF_STOCK:100 : 100 : 100 : 50
// let input = "UK:B123AB1234567:Gloves:20:Mask:10"  //  output = 2650 : 90 : 100 : 80 : 50
// let input = "Germany:B123AB1234567:Gloves:22:Mask:10" //  output = 3910 : 90 : 100 : 80 : 48

let output = process_order_details(input);
console.log(output);