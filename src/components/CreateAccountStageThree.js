import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import i18n from '../i18n';

// components
import SignupStagesActions from './SignupStagesActions';
import CustomPicker from './CustomPicker';
import Input from './Input';

// icons
import { Entypo, AntDesign } from '@expo/vector-icons';

// constants
import { CitiesName, Colors } from '../utils/constants';

const CreateAccountStageThree = ({ setStage, setPrevStage, obj, setObj }) => {
  const citiesOptions = [
    { value: CitiesName.NONE, label: i18n.t('city-name') },
    { value: CitiesName.ALEPPO, label: i18n.t('aleppo') },
    { value: CitiesName.DAMASCUS, label: i18n.t('damascus') },
    { value: CitiesName.DARAA, label: i18n.t('daraa') },
    { value: CitiesName.DEIR_EZ_ZOR, label: i18n.t('deir_ez_zor') },
    { value: CitiesName.HAMA, label: i18n.t('hama') },
    { value: CitiesName.AL_HASAKAH, label: i18n.t('al_hasakah') },
    { value: CitiesName.HOMS, label: i18n.t('homs') },
    { value: CitiesName.IDLIB, label: i18n.t('idlib') },
    { value: CitiesName.LATAKIA, label: i18n.t('latakia') },
    { value: CitiesName.QUNEITRA, label: i18n.t('quneitra') },
    { value: CitiesName.RAQQA, label: i18n.t('raqqa') },
    { value: CitiesName.AL_SUWAYDA, label: i18n.t('al_suwayda') },
    { value: CitiesName.TARTUS, label: i18n.t('tartus') },
    {
      value: CitiesName.DAMASCUS_COUNTRYSIDE,
      label: i18n.t('damascus_countryside'),
    },
  ];

  const [error, setError] = useState({
    mobile: '',
    city: '',
    addressDetails: '',
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

  const nextStageHandler = () => {
    let hasError = false;
    let errorObj = {
      mobile: '',
      city: '',
      addressDetails: '',
    };

    if (obj.mobile.trim().length === 0) {
      hasError = true;
      errorObj = {
        ...errorObj,
        mobile: 'enter-mobile',
      };
    }

    if (obj.addressDetails.trim().length === 0) {
      hasError = true;
      errorObj = {
        ...errorObj,
        addressDetails: 'enter address details',
      };
    }

    if (obj.city === CitiesName.NONE) {
      hasError = true;
      errorObj = {
        ...errorObj,
        city: 'enter-city',
      };
    }

    if (hasError) {
      setError(errorObj);
      return;
    }

    // setPrevStage(3);
    setStage(4);
  };

  const prevStageHandler = () => {
    // setPrevStage(3);
    setStage(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsView}>
        <CustomPicker
          selectedValue={obj.city}
          onChange={(value) => {
            setObj({
              ...obj,
              city: value,
            });
            setError({
              ...error,
              city: '',
            });
          }}
          data={citiesOptions}
          label={i18n.t('user-city')}
          error={error.city}
        />

        <Input
          value={obj.email}
          onTextChange={(text) => {
            inputChangeHandler('email', text);
          }}
          placeholder={i18n.t('user email-optional')}
          icon={<Entypo name="email" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          label={i18n.t('user email')}
        />

        <Input
          value={obj.phone}
          onTextChange={(text) => {
            inputChangeHandler('phone', text);
          }}
          placeholder={i18n.t('user phone-optional')}
          icon={<AntDesign name="phone" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          label={i18n.t('user phone')}
        />

        <Input
          value={obj.mobile}
          onTextChange={(text) => {
            inputChangeHandler('mobile', text);
          }}
          placeholder={i18n.t('user mobile')}
          icon={<Entypo name="mobile" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.mobile}
          label={i18n.t('user mobile')}
        />

        <Input
          value={obj.addressDetails}
          onTextChange={(text) => {
            inputChangeHandler('addressDetails', text);
          }}
          placeholder={i18n.t('user address details')}
          icon={<Entypo name="address" size={16} color={Colors.MAIN_COLOR} />}
          border={1}
          error={error.addressDetails}
          label={i18n.t('user address details')}
        />
      </View>
      <SignupStagesActions stage={3} prevHandler={prevStageHandler} nextHandler={nextStageHandler} />
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
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default CreateAccountStageThree;
