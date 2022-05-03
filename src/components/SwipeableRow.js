import i18n from 'i18n-js';
import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Colors, UserTypeConstants } from '../utils/constants';

import { AntDesign, Ionicons } from '@expo/vector-icons';

export default class SwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton
        style={{
          ...styles.leftAction,
          backgroundColor:
            this.props.user.type === UserTypeConstants.PHARMACY
              ? Colors.SUCCEEDED_COLOR
              : this.props.isInWarehouse
              ? Colors.FAILED_COLOR
              : Colors.SUCCEEDED_COLOR,
        }}
        onPress={() => {
          this.close();

          if (this.props.user.type === UserTypeConstants.WAREHOUSE) {
            if (this.props.isInWarehouse) {
              this.props.removeItemFromWarehouse();
            }

            if (!this.props.isInWarehouse) {
              this.props.addItemToWarehouse();
            }
          }

          if (this.props.user.type === UserTypeConstants.PHARMACY) {
            if (this.props.canAddToCart) {
              this.props.addToCart(this.props.item);
            }
          }
        }}
      >
        {this.props.user.type === UserTypeConstants.PHARMACY && (
          <View style={styles.leftView}>
            <Ionicons name="cart" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 2 }} />
            <Animated.Text style={[styles.actionText]}>{i18n.t('add-to-cart')}</Animated.Text>
          </View>
        )}
        {this.props.user.type === UserTypeConstants.WAREHOUSE && !this.props.isInWarehouse && (
          <View style={styles.leftView}>
            <Ionicons name="add-circle" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 2 }} />
            <Animated.Text style={[styles.actionText]}>{i18n.t('add-to-warehouse')}</Animated.Text>
          </View>
        )}
        {this.props.user.type === UserTypeConstants.WAREHOUSE && this.props.isInWarehouse && (
          <View style={styles.leftView}>
            <AntDesign name="delete" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 2 }} />
            <Animated.Text style={[styles.actionText]}>{i18n.t('remove-from-warehouse')}</Animated.Text>
          </View>
        )}
      </RectButton>
    );
  };

  // renderRightAction = (text, color, x, progress) => {
  //   const trans = progress.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [x, 0],
  //   });
  //   const pressHandler = () => {
  //     this.close();
  //     alert(text);
  //   };
  //   return (
  //     <Animated.View style={{ ...styles.leftAction, backgroundColor: Colors.YELLOW_COLOR }}>
  //       {/* <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}> */}
  //       <Text style={styles.actionText}>{text}</Text>
  //       {/* </RectButton> */}
  //     </Animated.View>
  //   );
  // };

  renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton
        style={{
          ...styles.rightAction,
          backgroundColor: Colors.YELLOW_COLOR,
        }}
        onPress={() => {
          this.close();

          if (this.props.isFavorite === true) {
            this.props.removeItemFromFavorite();
          } else {
            this.props.addItemToFavorite();
          }
        }}
      >
        {this.props.isFavorite === true ? (
          <View style={styles.leftView}>
            <AntDesign name="star" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 2 }} />
            <Animated.Text style={[styles.actionText]}>{i18n.t('remove-from-favorite-tooltip')}</Animated.Text>
          </View>
        ) : (
          <View style={styles.leftView}>
            <AntDesign name="staro" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 2 }} />
            <Animated.Text style={[styles.actionText]}>{i18n.t('add-to-favorite-tooltip')}</Animated.Text>
          </View>
        )}
      </RectButton>
    );
  };

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={
          ((this.props.user.type === UserTypeConstants.PHARMACY && this.props.canAddToCart) ||
            this.props.user.type === UserTypeConstants.WAREHOUSE) &&
          this.renderLeftActions
        }
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 12,
  },
  leftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 12,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
});
