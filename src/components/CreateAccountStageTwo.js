import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import i18n from '../i18n';

// icons
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// components
import SignupStagesActions from './SignupStagesActions';
import Input from './Input';

// constants
import { BASEURL, Colors, UserTypeConstants } from '../utils/constants';

const CreateAccountStageTwo = ({ type, obj, setObj, setStage, setPrevStage }) => {
  const placeholder =
    type === UserTypeConstants.COMPANY
      ? 'enter-company-name'
      : type === UserTypeConstants.WAREHOUSE
      ? 'enter-warehouse-name'
      : type === UserTypeConstants.PHARMACY
      ? 'enter-pharmacy-name'
      : 'enter-guest-name';

  const [checking, setChecking] = useState(false);

  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  const inputChangeHandler = (key, value) => {
    setObj({
      ...obj,
      [key]: value,
    });
    setError({
      ...error,
      [key]: '',
    });
  };

  const nextStageHandler = async () => {
    setChecking(true);

    let hasError = false;
    let errorObj = {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
    };
    if (obj.name.trim().length === 0) {
      hasError = true;
      errorObj = {
        ...errorObj,
        name: 'enter-name',
      };
    }

    if (obj.username.trim().length === 0) {
      hasError = true;

      errorObj = {
        ...errorObj,
        username: 'enter-username',
      };
    }

    if (obj.password.length === 0) {
      hasError = true;

      errorObj = {
        ...errorObj,
        password: 'enter-password',
      };
    } else if (obj.password.length < 5) {
      // password must be greater than or equals to 5 characters
      hasError = true;

      errorObj = {
        ...errorObj,
        password: 'password-length',
      };
    }

    if (obj.passwordConfirm.length === 0) {
      hasError = true;

      errorObj = {
        ...errorObj,
        passwordConfirm: 'enter-password-confirm',
      };
    } else if (obj.passwordConfirm.length < 5) {
      // password confirm must be greater than or equals to 5 characters
      hasError = true;

      errorObj = {
        ...errorObj,
        passwordConfirm: 'confirm-password-length',
      };
    }

    // password must be equals to password confirm
    if (obj.password.length >= 5 && obj.passwordConfirm.length >= 5 && obj.password !== obj.passwordConfirm) {
      hasError = true;

      errorObj = {
        ...errorObj,
        password: 'unequal-passwords',
        passwordConfirm: 'unequal-passwords',
      };
    }

    if (obj.username.trim().length > 0) {
      const response = await axios.get(`${BASEURL}/users/check-username/${obj.username}`);

      if (!response.data.available) {
        hasError = true;
        errorObj = {
          ...errorObj,
          username: 'provide unique name',
        };
      }
    }

    setChecking(false);

    if (hasError) {
      setError(errorObj);
      return;
    }
    // setPrevStage(2);
    setStage(3);
  };

  const prevStageHandler = () => {
    // setPrevStage(2);
    setStage(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsView}>
        <Input
          value={obj.name}
          onTextChange={(text) => {
            inputChangeHandler('name', text);
          }}
          placeholder={i18n.t(placeholder)}
          icon={<AntDesign name="user" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.name}
          label={i18n.t('user-name')}
        />

        <Input
          value={obj.username}
          onTextChange={(text) => {
            inputChangeHandler('username', text);
          }}
          placeholder={i18n.t('user-username')}
          icon={<AntDesign name="user" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.username}
          label={i18n.t('user-username')}
        />
        <Input
          value={obj.password}
          onTextChange={(text) => {
            inputChangeHandler('password', text);
          }}
          placeholder={i18n.t('enter-password')}
          password={true}
          icon={<FontAwesome name="lock" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.password}
          label={i18n.t('user-password')}
        />
        <Input
          value={obj.passwordConfirm}
          onTextChange={(text) => {
            inputChangeHandler('passwordConfirm', text);
          }}
          placeholder={i18n.t('enter-password-confirm')}
          password={true}
          icon={<FontAwesome name="lock" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.passwordConfirm}
          label={i18n.t('user-password-confirm')}
        />
      </View>
      {checking ? (
        <ActivityIndicator size="large" color={Colors.WHITE_COLOR} style={{ flex: 1 }} />
      ) : (
        <SignupStagesActions stage={2} nextHandler={nextStageHandler} prevHandler={prevStageHandler} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  inputsView: {
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default CreateAccountStageTwo;
