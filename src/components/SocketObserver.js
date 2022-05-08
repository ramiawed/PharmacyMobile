import React, { useEffect, useState } from 'react';

// components

// redux stuff
import { useDispatch, useSelector } from 'react-redux';

// constants
import { Colors, SERVER_URL, UserTypeConstants } from '../utils/constants';

// socket
import socketIoClient from 'socket.io-client';
import { authSliceSignOut, selectUserData } from '../redux/auth/authSlice';
import { deleteOrderSocket, getUnreadOrders, setForceRefresh, updateOrderStatus } from '../redux/orders/ordersSlice';
import { addAdvertisementSocket } from '../redux/advertisements/advertisementsSlice';

const socket = socketIoClient(`${SERVER_URL}`, { autoConnect: false });

function SocketObserver() {
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);

  // own state

  const handleSignOut = () => {
    // dispatch(authSliceSignOut());
    // dispatch(cartSliceSignOut());
    // dispatch(companySliceSignOut());
    // dispatch(favoritesSliceSignOut());
    // dispatch(itemsSliceSignOut());
    // dispatch(statisticsSliceSignOut());
    // dispatch(usersSliceSignOut());
    // dispatch(warehouseSliceSignOut());
    // dispatch(warehouseItemsSliceSignOut());
    // dispatch(orderSliceSignOut());
    // dispatch(resetMedicines());
    // dispatch(advertisementsSignOut());
    // dispatch(companiesSectionOneSignOut());
    // dispatch(companiesSectionTwoSignOut());
    // dispatch(itemsSectionOneSignOut());
    // dispatch(itemsSectionThreeSignOut());
    // dispatch(itemsSectionTwoSignOut());
    // dispatch(warehousesSectionOneSignOut());
    // dispatch(medicinesSliceSignOut());
    // dispatch(notificationsSignOut());
    // dispatch(settingsSignOut());
    // dispatch(usersNotificationsSignOut());
  };

  useEffect(() => {
    // orders observer
    socket.on('order-changed', (data) => {
      if (data.operationType === 'insert') {
        if (
          user.type === UserTypeConstants.ADMIN ||
          (user.type === UserTypeConstants.WAREHOUSE && user._id === data.fullDocument.warehouse)
        ) {
          dispatch(setForceRefresh(true));
          dispatch(getUnreadOrders({ token }));
        }
      }

      if (data.operationType === 'delete') {
        dispatch(deleteOrderSocket({ id: data.documentKey._id }));
      }

      if (data.operationType === 'update') {
        dispatch(
          updateOrderStatus({
            id: data.documentKey._id,
            fields: data.updateDescription.updatedFields,
          }),
        );
      }
    });

    // advertisements observer
    socket.on('new-advertisement', (data) => {
      dispatch(addAdvertisementSocket(data));
    });

    // // notifications observer
    // if (user.type !== UserTypeConstants.ADMIN) {
    //   socket.on('notification-changed', (data) => {
    //     if (data.operationType === 'insert') {
    //       dispatch(notificationForceRefresh(true));
    //       dispatch(getUnreadNotification({ token }));
    //       setNotificationData(data.fullDocument);
    //     }

    //     if (data.operationType === 'delete') {
    //       dispatch(notificationForceRefresh(true));
    //       dispatch(getUnreadNotification({ token }));
    //     }
    //   });
    // }

    // // settings change observer
    // if (user.type !== UserTypeConstants.ADMIN) {
    //   socket.on('settings-changed', (data) => {
    //     dispatch(socketUpdateSettings(data.updateDescription.updatedFields));
    //   });
    // }

    // // sign out observer
    // socket.on('user-sign-out', (data) => {
    //   if (user._id === data) {
    //     handleSignOut();
    //   }
    // });

    // // new user
    // if (user.type === UserTypeConstants.ADMIN) {
    //   socket.on('user-added', (data) => {
    //     setUserAddedMsg('new-user-added');
    //     dispatch(setRefresh(true));
    //   });
    // }

    // // user section one and two observer
    // if (user.type !== UserTypeConstants.ADMIN) {
    //   socket.on('user-added-to-section-one', (data) => {
    //     dispatch(addCompanyToSectionOneSocket(data));
    //   });

    //   socket.on('user-added-to-section-two', (data) => {
    //     dispatch(addCompanyToSectionTwoSocket(data));
    //   });

    //   socket.on('warehouse-added-to-section-one', (data) => {
    //     dispatch(addWarehouseToSectionOneSocket(data));
    //   });

    //   socket.on('user-removed-from-section-one', (data) => {
    //     dispatch(removeCompanyFromSectionOneSocket(data));
    //   });

    //   socket.on('user-removed-from-section-two', (data) => {
    //     dispatch(removeCompanyFromSectionTwoSocket(data));
    //   });

    //   socket.on('warehouse-removed-from-section-one', (data) => {
    //     dispatch(removeWarehouseToSectionOneSocket(data));
    //   });

    //   socket.on('item-added-to-section-one', (data) => {
    //     dispatch(addItemToSectionOneSocket(data));
    //   });

    //   socket.on('item-removed-from-section-one', (data) => {
    //     dispatch(removeItemFromSectionOneSocket(data));
    //   });

    //   socket.on('item-added-to-section-two', (data) => {
    //     dispatch(addItemToSectionTwoSocket(data));
    //   });

    //   socket.on('item-removed-from-section-two', (data) => {
    //     dispatch(removeItemFromSectionTwoSocket(data));
    //   });

    //   socket.on('item-added-to-section-three', (data) => {
    //     dispatch(addItemToSectionThreeSocket(data));
    //   });

    //   socket.on('item-removed-from-section-three', (data) => {
    //     dispatch(removeItemFromSectionThreeSocket(data));
    //   });
    // }

    // // item section one and two observer
    // if (user.type !== UserTypeConstants.ADMIN) {
    //   socket.on('new-advertisement', (data) => {
    //     dispatch(addAdvertisementSocket(data));
    //   });
    // }

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <></>;
}

export default SocketObserver;
