import React, { useDebugValue, useState } from 'react';
import i18n from '../i18n';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';

// libraries
import CheckBox from 'expo-checkbox';
import { BottomSheet } from 'react-native-btr';

// components
import ConfirmBottomSheet from './ConfirmBottomSheet';
import Loader from './Loader';


// constants and utils
import { Colors, UserTypeConstants } from '../utils/constants';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { saveOrder } from '../redux/basketOrdersSlice/basketOrdersSlice';

const Basket = ({basket}) => {
    const dispatch = useDispatch();
    const calculateBasketTotalPrice = () => {
        let total = 0;
        basket.items.forEach((i) => {
          if (i.item !== null) {
            if (!i.isFree) {
              total += i.qty * i.item.price;
            }
          }
        });
        return total;
      };

    const orderBasketHandler = () => {
        setShowOrderBasketModal(false);
        const data = {
            obj: {
              warehouseId: basket.warehouse._id,
              basketId: basket._id,
            },
            token,
          };
        setShowLoadingModal(true);
        dispatch(saveOrder(data))
        .then(unwrapResult)
        .then(() => {
            setShowLoadingModal(false);
            Toast.show({
                type: 'success',
                text1: i18n.t('order-basket'),
                text2: i18n.t('order-basket-succeeded'),
              });
        })
        .catch((err) => {
            setShowLoadingModal(false);
            Toast.show({
                type: 'error',
                text1: i18n.t('order-basket'),
                text2: i18n.t('order-basket-failed'),
              });
        });
    };

    const {user, token} = useSelector(selectUserData);  

    const [showOrderBasketModal, setShowOrderBasketModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    return (
        <>
            <View style={styles.container}>
                {basket.warehouse.name && (
                    <View style={styles.row}>
                        <Text style={styles.warehouseName}>{basket.warehouse.name}</Text>
                    </View>
                )}
                
                {
                    basket.items.map(item => (
                        <View key={item._id} style={styles.itemContainer}>
                            <Text style={styles.itemName}>{item.item.name}</Text>
                            <View style={styles.itemDetails}>
                                <View style={styles.itemDetailsCell}>
                                    <Text style={styles.itemDetailsLabel}>{i18n.t('item-price')}</Text>
                                    <Text style={styles.itemDetailsValue}>{item.item.price}</Text>
                                </View>
                                <View style={styles.itemDetailsCell}>
                                    <Text style={styles.itemDetailsLabel}>{i18n.t('free')}</Text>
                                    <CheckBox value={item.isFree} style={{
                                        width: 16,
                                        height: 16
                                    }}  />
                                </View >
                                <View style={styles.itemDetailsCell}>
                                    <Text style={styles.itemDetailsLabel}>{i18n.t('item-qty')}</Text>
                                    <Text style={styles.itemDetailsValue}>{item.qty}</Text>
                                </View>
                                <View style={styles.itemDetailsCell}>
                                    <Text style={styles.itemDetailsLabel}>{i18n.t('pieces')}</Text>
                                    <Text style={styles.itemDetailsValue}>{item.bonus}</Text>
                                </View>
                                <View style={styles.itemDetailsCell}>
                                    <Text style={styles.itemDetailsLabel}>{i18n.t('total-price')}</Text>
                                    <Text style={styles.itemDetailsValue}>{item.isFree ? 0 : item.qty * item.item.price}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                }
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-total-items")}</Text>
                    <Text style={styles.value}>{basket.items.length}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-total-price")}</Text>
                    <Text style={styles.value}>{calculateBasketTotalPrice()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-total-discount")}</Text>
                    <Text style={styles.value}>{basket.discount}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-total-price-after-discount")}</Text>
                    <Text style={styles.value}>{basket.discount !== 0
                        ? calculateBasketTotalPrice() -
                        (calculateBasketTotalPrice() * basket.discount) / 100
                        : calculateBasketTotalPrice()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-gift-label")}</Text>
                    <Text style={styles.value}>{basket.gift}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.label, styles.minWidth]}>{i18n.t("basket-note-label")}</Text>
                    <Text style={styles.value}>{basket.note}</Text>
                </View>
                {
                    user.type === UserTypeConstants.PHARMACY && (
                    <TouchableOpacity style={styles.orderBtn} onPress={() => setShowOrderBasketModal(true)}>
                        <Text style={styles.orderText}>{i18n.t('order-basket')}</Text>
                    </TouchableOpacity>
                    )
                }
                
                
            </View>
            <BottomSheet
                    visible={showOrderBasketModal}
                    onBackButtonPress={() => setShowOrderBasketModal(false)}
                    onBackdropPress={() => setShowOrderBasketModal(false)}
                >
                    <ConfirmBottomSheet 
                        header="order-basket" 
                        message="order-basket-msg" 
                        okAction={orderBasketHandler} 
                        cancelAction={() => setShowOrderBasketModal(false)}
                        okLabel="ok-label"
                        cancelLabel="cancel-label"
                    />
            </BottomSheet>

            {showLoadingModal && <Loader />}
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE_COLOR,
        borderWidth: 3,
        borderColor: Colors.GREY_COLOR,
        borderRadius: 6,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        overflow: 'hidden'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    label: {
        marginEnd: 5,
        color: Colors.GREY_COLOR,
        fontSize: 12
    },
    value: {
        color: Colors.MAIN_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
        justifyContent: 'flex-start',
        textAlign: 'left'
    },
    minWidth: {
        minWidth: 150
    },
    itemContainer: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: Colors.GREY_COLOR,
        paddingBottom: 5,
        marginBottom: 5,
        borderRadius: 6
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    itemName: {
        flex: 1,
        justifyContent: 'flex-start',
        textAlign: 'left',
        padding: 5,
        color: Colors.MAIN_COLOR
    },
    itemDetailsCell: {
        alignItems: 'center'
    },
    itemDetailsLabel: {
        color: Colors.SUCCEEDED_COLOR,
        fontSize: 12,
        marginBottom: 3
    },
    itemDetailsValue: {
        color: Colors.MAIN_COLOR,
    },
    warehouseName: {
        textAlign: 'center',
        flex: 1,
        color:Colors.WHITE_COLOR,
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: Colors.SUCCEEDED_COLOR,
        borderRadius: 6,
        padding: 5
    },
    orderBtn: {
        backgroundColor: Colors.GREY_COLOR,
        padding: 8,
        borderRadius: 6
    },
    orderText: {
        color: Colors.WHITE_COLOR,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default Basket;