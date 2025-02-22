import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Наушники Redmi', price: 700, description: 'Синего цвета'},
    {id: '2', title: 'Наушники Perfeo ALPHA', price: 90, description: 'Зеленого цвета'},
    {id: '3', title: 'Defender Basic 210', price: 700, description: 'Синего цвета'},
    {id: '4', title: 'Наушники Perfeo ALPHA ', price: 200, description: 'Зеленого цвета'},
    {id: '5', title: 'Наушники Smartbuy S6', price: 600, description: 'Синего цвета'},
    {id: '6', title: 'Наушники GAL HM-085', price: 600, description: 'Зеленого цвета'},
    {id: '7', title: 'Наушники GAL HM-085', price: 500, description: 'Синего цвета'},
    {id: '8', title: 'Наушники Red Line S3', price: 400, description: 'Зеленого цвета'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
