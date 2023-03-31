import React from 'react';
import i18n from '../i18n';
import { View, Text, StyleSheet } from 'react-native';

// components
import SignupStagesActions from './SignupStagesActions';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

const CreateAccountStageOne = ({ type, changeType, setStage, setPrevStage, resetStageFourInfo }) => {
  const nextStageHandler = () => {
    // setPrevStage(1);
    setStage(2);
  };

  const changeUserTypeHanlder = (userType) => {
    changeType(userType);
    resetStageFourInfo();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{i18n.t('choose user type')}</Text>
        <Text
          style={[styles.option, type === UserTypeConstants.COMPANY ? styles.selected : null]}
          onPress={() => changeUserTypeHanlder(UserTypeConstants.COMPANY)}
        >
          {i18n.t('company')}
        </Text>
        <Text
          style={[styles.option, type === UserTypeConstants.WAREHOUSE ? styles.selected : null]}
          onPress={() => changeUserTypeHanlder(UserTypeConstants.WAREHOUSE)}
        >
          {i18n.t('warehouse')}
        </Text>

        <Text
          style={[styles.option, type === UserTypeConstants.PHARMACY ? styles.selected : null]}
          onPress={() => changeUserTypeHanlder(UserTypeConstants.PHARMACY)}
        >
          {i18n.t('pharmacy')}
        </Text>

        <Text
          style={[styles.option, type === UserTypeConstants.GUEST ? styles.selected : null]}
          onPress={() => changeUserTypeHanlder(UserTypeConstants.GUEST)}
        >
          {i18n.t('normal')}
        </Text>
        <SignupStagesActions stage={1} nextHandler={nextStageHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  option: {
    textAlign: 'center',
    backgroundColor: '#747EAD',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
    marginVertical: 5,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 6,
  },
  selected: {
    backgroundColor: Colors.OFFER_COLOR,
    color: Colors.MAIN_COLOR,
  },
  title: {
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateAccountStageOne;
