import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';

// components
import CreateAccountStageThree from '../components/CreateAccountStageThree';
import CreateAccountStageFour from '../components/CreateAccountStageFour';
import CreateAccountStageOne from '../components/CreateAccountStageOne';
import CreateAccountStageTwo from '../components/CreateAccountStageTwo';
import NavigateBetweenSign from '../components/NavigateBetweenSign';
import SignHeaderWithLogo from '../components/SignHeaderWithLogo';
import SignupStagesNumber from '../components/SignupStagesNumber';
import HeaderWithSlogn from '../components/HeaderWithSlogn';
import License from '../components/License';
import Loader from '../components/Loader';
import Button from '../components/Button';

// constants
import { CitiesName, Colors, UserTypeConstants, BASEURL } from '../utils/constants';

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showLicenseModel, setShowLicenseModal] = useState(false);
  const [loadingSignUpMsg, setLoadingSignUpMsg] = useState('');
  const [loadingPaperUrlMsg, setLoadingPaperUrlMsg] = useState('');

  const [stage, setStage] = useState(1);
  // const [prevStage, setPrevStage] = useState(0);
  const [userType, setUserType] = useState(UserTypeConstants.GUEST);
  const [stageTwoInfo, setStageTwoInfo] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [stageThreeInfo, setStageThreeInfo] = useState({
    email: '',
    phone: '',
    mobile: '',
    city: CitiesName.NONE,
    addressDetails: '',
  });
  const [stageFourInfo, setStageFourInfo] = useState({
    employeeName: '',
    certificateName: '',
    paperUrl: null,
    guestDetails: {
      job: '',
      companyName: '',
      jobTitle: '',
    },
  });

  const resetStageFourInfo = () => {
    setStageFourInfo({
      employeeName: '',
      certificateName: '',
      paperUrl: null,
      guestDetails: {
        job: '',
        companyName: '',
        jobTitle: '',
      },
    });
  };

  // contains all user information to create a new user
  const [user, setUser] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    mobile: '',
    city: CitiesName.NONE,
    addressDetails: '',
    type: UserTypeConstants.GUEST,
    employeeName: '',
    certificateName: '',
    paperUrl: null,
    guestDetails: {
      job: '',
      companyName: '',
      jobTitle: '',
    },
  });

  // reset all state to default
  const signInHandler = () => {
    // reset user
    setUser({
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      phone: '',
      mobile: '',
      city: '',
      addressDetails: '',
      type: UserTypeConstants.GUEST,
      employeeName: '',
      certificateName: '',
      paperUrl: null,
      guestDetails: {
        job: '',
        companyName: '',
        jobTitle: '',
      },
    });

    navigation.navigate('SignIn');
  };

  // handle click on the create an account button
  // check name, username, password, passwordConfirm to be not empty
  // check the password and passwordConfirm length (must be greater than or equals to 8)
  // check the equality of the password and passwordConfirm
  const createAccountHandler = () => {
    setUser({
      type: userType,
      ...stageTwoInfo,
      ...stageThreeInfo,
      ...stageFourInfo,
    });

    setShowLicenseModal(true);
  };

  const newAccountHandler = async () => {
    setShowLicenseModal(false);
    setLoading(true);
    setLoadingSignUpMsg('create-user-msg');

    try {
      const userResponse = await axios.post(`${BASEURL}/users/signup`, user, {});

      if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST) {
        setLoadingSignUpMsg('create-user-succeeded-msg');
        setLoadingPaperUrlMsg('paper-loading-msg');

        const data = new FormData();

        data.append('id', userResponse.data.data.id);
        let localUri = user.paperUrl.uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        data.append('file', { uri: localUri, name: filename, type });

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };

        try {
          await axios.post(`${BASEURL}/users/upload-license`, data, config);
          setLoadingSignUpMsg('');
          setLoadingPaperUrlMsg('');
          setLoading(false);
          navigation.navigate('Approve');
        } catch (err) {
          setLoadingSignUpMsg('');
          setLoadingPaperUrlMsg('');
          setLoading(false);
        }
      } else {
        setLoadingSignUpMsg('');
        setLoading(false);
        navigation.navigate('Approve');
      }
    } catch (err) {
      let text2 = '';
      if (err.code === 'ECONNABORTED' && err.message.startsWith('timeout')) {
        text2 = i18n.t('timeout-msg');
      } else if (!err.response) {
        text2 = i18n.t('network failed');
      } else if (err.response.data) {
        setError({
          [err.response.data.field[0]]: err.response.data.message,
        });
      } else {
        text2 = i18n.t('error');
      }

      setLoading(false);

      Toast.show({
        type: 'error',
        text1: i18n.t('sign up-error'),
        text2: text2,
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.signUpView}>
          <HeaderWithSlogn />
          <View style={styles.inputsView}>
            <SignHeaderWithLogo isSignIn={false} />
            <SignupStagesNumber
              stage={stage}
              stagesArray={userType !== UserTypeConstants.COMPANY ? [1, 2, 3, 4] : [1, 2, 3]}
            />

            {stage === 1 && (
              <CreateAccountStageOne
                type={userType}
                changeType={setUserType}
                setStage={setStage}
                // setPrevStage={setPrevStage}
                resetStageFourInfo={resetStageFourInfo}
              />
            )}

            {stage === 2 && (
              <CreateAccountStageTwo
                obj={stageTwoInfo}
                type={userType}
                setObj={setStageTwoInfo}
                setStage={setStage}
                // setPrevStage={setPrevStage}
              />
            )}

            {stage === 3 && (
              <CreateAccountStageThree
                setStage={setStage}
                // setPrevStage={setPrevStage}
                obj={stageThreeInfo}
                setObj={setStageThreeInfo}
              />
            )}

            {stage === 4 && userType !== UserTypeConstants.COMPANY && (
              <CreateAccountStageFour
                userType={userType}
                setStage={setStage}
                // setPrevStage={setPrevStage}
                obj={stageFourInfo}
                setObj={setStageFourInfo}
              />
            )}

            {((stage === 4 && userType === UserTypeConstants.COMPANY) || stage === 5) && (
              <View style={{ width: '100%' }}>
                <TouchableOpacity style={[styles.button]} onPress={createAccountHandler}>
                  <Text style={styles.buttonText}>{i18n.t('sign up press label')}</Text>
                </TouchableOpacity>
                <View style={styles.prevBtnContainer}>
                  <Button
                    color={Colors.SUCCEEDED_COLOR}
                    pressHandler={() => {
                      // setPrevStage(stage);
                      setStage(stage - 1);
                    }}
                    text={i18n.t('previous')}
                  />
                </View>
              </View>
            )}
          </View>
          <NavigateBetweenSign isSignIn={false} pressHandler={signInHandler} />
        </View>
      </View>

      {showLicenseModel && (
        <License
          action={newAccountHandler}
          close={() => {
            setShowLicenseModal(false);
          }}
        />
      )}

      {loading && <Loader msg1={loadingSignUpMsg} msg2={loadingPaperUrlMsg} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6872A6',
    paddingVertical: 20,
  },
  scrollView: {
    minWidth: '100%',
    alignItems: 'center',
  },
  signUpView: {
    borderRadius: 15,
    width: '90%',
    minHeight: '65%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  prevBtnContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  inputsView: {
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 30,
  },
  button: {
    paddingVertical: 10,
    marginVertical: 20,
    backgroundColor: Colors.OFFER_COLOR,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
});

export default SignupScreen;
