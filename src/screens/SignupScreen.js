import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';

// components
import Input from '../components/Input';
import UserType from '../components/UserType';
import CustomPicker from '../components/CustomPicker';
import License from '../components/License';
import Loader from '../components/Loader';

// constants
import { CitiesName, Colors, GuestJob, UserTypeConstants, BASEURL } from '../utils/constants';

// icons
import { AntDesign, MaterialCommunityIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userPaperUrlLabel, setUserPaperUrlLabel] = useState('choose-paper-url-guest');
  const [showLicenseModel, setShowLicenseModal] = useState(false);

  // guest options and its change handler
  const guestJobOptions = [
    { value: GuestJob.NONE, label: i18n.t('user-job') },
    { value: GuestJob.STUDENT, label: i18n.t('student') },
    { value: GuestJob.PHARMACIST, label: i18n.t('pharmacist') },
    { value: GuestJob.EMPLOYEE, label: i18n.t('employee') },
  ];

  const citiesOptions = [
    { value: CitiesName.ALL, label: i18n.t('all-cities') },
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSignUpUser({
        ...signUpUser,
        paperUrl: result,
      });
      setError({
        ...error,
        paperUrl: '',
      });
    }
  };

  const [namePlaceHolder, setNamePlaceHolder] = useState('enter-guest-name');
  // contains all user information to create a new user
  const [signUpUser, setSignUpUser] = useState({
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
      job: GuestJob.NONE,
      companyName: '',
      jobTitle: '',
    },
  });

  // state to hold the error with the field that cause the error
  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    mobile: '',
    job: '',
    employeeName: '',
    certificateName: '',
    companyName: '',
    jobTitle: '',
    addressDetails: '',
    city: '',
    paperUrl: '',
  });

  const changeUserType = (type) => {
    if (type === UserTypeConstants.COMPANY) {
      setNamePlaceHolder('enter-company-name');
      setUserPaperUrlLabel('');
      setError({
        ...error,
        companyName: '',
        jobTitle: '',
        job: '',
        employeeName: '',
        certificateName: '',
      });
      setSignUpUser({
        ...signUpUser,
        type: type,
        paperUrl: null,
        guestDetails: {
          ...signUpUser.guestDetails,
          job: GuestJob.NONE,
        },
      });
    }

    if (type === UserTypeConstants.WAREHOUSE) {
      setNamePlaceHolder('enter-warehouse-name');
      setUserPaperUrlLabel('');
      setError({
        ...error,
        companyName: '',
        jobTitle: '',
        job: '',
      });
      setSignUpUser({
        ...signUpUser,
        type: type,
        paperUrl: null,
        guestDetails: {
          ...signUpUser.guestDetails,
          job: GuestJob.NONE,
        },
      });
    }

    if (type === UserTypeConstants.PHARMACY) {
      setNamePlaceHolder('enter-pharmacy-name');
      setUserPaperUrlLabel('choose-paper-url-pharmacy');
      setError({
        ...error,
        companyName: '',
        jobTitle: '',
        job: '',
      });
      setSignUpUser({
        ...signUpUser,
        type: type,
        paperUrl: signUpUser.paperUrl,
        guestDetails: {
          ...signUpUser.guestDetails,
          job: GuestJob.NONE,
        },
      });
    }

    if (type === UserTypeConstants.GUEST) {
      setNamePlaceHolder('enter-guest-name');
      setUserPaperUrlLabel('choose-paper-url-guest');
      setError({
        ...error,
        companyName: '',
        jobTitle: '',
        job: '',
        employeeName: '',
        certificateName: '',
      });
      setSignUpUser({
        ...signUpUser,
        type: type,
        paperUrl: signUpUser.paperUrl,
      });
    }
  };

  // reset all state to default
  const signInHandler = () => {
    // reset user
    setSignUpUser({
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

    // reset error
    setError({
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      mobile: '',
      employeeName: '',
      certificateName: '',
      job: '',
      companyName: '',
      jobTitle: '',
      addressDetails: '',
      city: '',
      paperUrl: '',
    });

    navigation.navigate('SignIn');
  };

  const cityChangeHandler = (value) => {
    setSignUpUser({
      ...signUpUser,
      city: value,
    });
    setError({
      ...error,
      city: '',
    });
  };

  const guestTypeChangeHandler = (val) => {
    // if the user type is Normal and the job is Student or Pharmacist
    // so the user doesn't contains info about company name and job title
    if (val === GuestJob.STUDENT || val === GuestJob.PHARMACIST) {
      setSignUpUser({
        ...signUpUser,
        guestDetails: {
          ...signUpUser.guestDetails,
          job: val,
          // reset company name and job title
          companyName: '',
          jobTitle: '',
        },
      });
    } else {
      setSignUpUser({
        ...signUpUser,

        guestDetails: {
          ...signUpUser.guestDetails,
          job: val,
        },
      });
    }

    // reset the error
    setError({
      ...error,
      job: '',
      companyName: '',
      employeeName: '',
      certificateName: '',
      jobTitle: '',
    });
  };

  // handle click on the create an account button
  // check name, username, password, passwordConfirm to be not empty
  // check the password and passwordConfirm length (must be greater than or equals to 8)
  // check the equality of the password and passwordConfirm
  const createAccountHandler = () => {
    const errorObj = {};
    if (signUpUser.name.trim().length === 0) {
      errorObj['name'] = 'enter-name';
    }

    if (signUpUser.username.trim().length === 0) {
      errorObj['username'] = 'enter-username';
    }

    if (signUpUser.password.length === 0) {
      errorObj['password'] = 'enter-password';
    } else if (signUpUser.password.length < 5) {
      // password must be greater than or equals to 5 characters
      errorObj['password'] = 'password-length';
    }

    if (signUpUser.passwordConfirm.length === 0) {
      errorObj['passwordConfirm'] = 'enter-password-confirm';
    } else if (signUpUser.passwordConfirm.length < 5) {
      // password confirm must be greater than or equals to 5 characters
      errorObj['passwordConfirm'] = 'confirm-password-length';
    }

    // password must be equals to password confirm
    if (
      signUpUser.password.length >= 5 &&
      signUpUser.passwordConfirm.length >= 5 &&
      signUpUser.password !== signUpUser.passwordConfirm
    ) {
      errorObj['password'] = 'unequal-passwords';
      errorObj['passwordConfirm'] = 'unequal-passwords';
    }

    if (signUpUser.mobile.length === 0) {
      errorObj['mobile'] = 'enter-mobile';
    }

    if (signUpUser.city === CitiesName.NONE || signUpUser.city === CitiesName.ALL) {
      errorObj['city'] = 'enter-city';
    }

    if (signUpUser.addressDetails.length === 0) {
      errorObj['addressDetails'] = 'enter-address-details';
    }

    // if the user type is Pharmacy or Warehouse
    // employee name and certificate name are required
    if (signUpUser.type === UserTypeConstants.PHARMACY || signUpUser.type === UserTypeConstants.WAREHOUSE) {
      if (signUpUser.employeeName.trim().length === 0) {
        errorObj['employeeName'] = 'enter-employee-name';
      }

      if (signUpUser.certificateName.trim().length === 0) {
        errorObj['certificateName'] = 'enter-certificate-name';
      }
    }

    // if user type is normal
    // 1- the job required
    // 2- if the job is employee (job title, company name are required)
    if (signUpUser.type === UserTypeConstants.GUEST) {
      if (signUpUser.guestDetails.job === GuestJob.EMPLOYEE) {
        if (signUpUser.guestDetails.jobTitle.trim().length === 0) {
          errorObj['jobTitle'] = 'enter-job-title';
        }

        if (signUpUser.guestDetails.companyName.trim().length === 0) {
          errorObj['companyName'] = 'enter-company-name';
        }
      }

      // job is required
      if (signUpUser.guestDetails.job === GuestJob.NONE) {
        errorObj['job'] = 'choose-job';
      }
    }

    if (signUpUser.type === UserTypeConstants.PHARMACY || signUpUser.type === UserTypeConstants.GUEST) {
      if (signUpUser.paperUrl === null) {
        errorObj['paperUrl'] = 'enter-paper-url';
      }
    }

    // send post request to server to create a new user
    if (Object.entries(errorObj).length === 0) {
      setShowLicenseModal(true);
    } else {
      setError(errorObj);
    }
  };

  const newAccountHandler = () => {
    setShowLicenseModal(false);
    setLoading(true);

    axios
      .post(`${BASEURL}/users/signup`, signUpUser, {})
      .then((response) => {
        // if create user succeeded
        if (signUpUser.type === UserTypeConstants.PHARMACY || signUpUser.type === UserTypeConstants.GUEST) {
          const data = new FormData();

          data.append('id', response.data.data.id);
          let localUri = signUpUser.paperUrl.uri;
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

          axios
            .post(`${BASEURL}/users/upload-license`, data, config)
            .then(() => {
              // user type is not normal
              // redirect to approve page
              setLoading(false);
              navigation.navigate('Approve');
            })
            .catch((err) => {});
        } else {
          // user type is not normal
          // redirect to approve page
          setLoading(false);
          navigation.navigate('Approve');
        }
      })
      .catch((err) => {
        let text2 = '';
        if (err.code === 'ECONNABORTED' && err.message.startsWith('timeout')) {
          text2 = i18n.t('timeout-msg');
          setLoading(false);
        } else if (!err.response) {
          text2 = i18n.t('network failed');
          setLoading(false);
        } else if (err.response.data) {
          setError({
            [err.response.data.field[0]]: err.response.data.message,
          });
          setLoading(false);
        } else {
          text2 = i18n.t('error');
          setLoading(false);
        }

        Toast.show({
          type: 'error',
          text1: i18n.t('sign-up-error'),
          text2: text2,
        });
      });
  };

  return (
    <>
      <View style={styles.container}>
        {/* <LinearGradient
          // Background Linear Gradient
          colors={[Colors.MAIN_COLOR, Colors.WHITE_COLOR]}
          style={styles.background}
        /> */}
        <LinearGradient
          // Background Linear Gradient
          colors={[Colors.WHITE_COLOR, Colors.MAIN_COLOR]}
          style={styles.background}
        />
        <View style={styles.signUpView}>
          <View style={styles.inputDiv}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <Image style={styles.logo} source={require('../../assets/logo.png')} />
              <Text style={[styles.signUpLabel, styles.bigFont]}>{i18n.t('sign-up')}</Text>

              <UserType userType={signUpUser.type} userTypeChange={changeUserType} />
              <Input
                value={signUpUser.name}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    name: text,
                  });
                  setError({
                    ...error,
                    name: '',
                  });
                }}
                placeholder={i18n.t(namePlaceHolder)}
                icon={<AntDesign name="user" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.name}
                label={i18n.t('user-name')}
              />
              <Input
                value={signUpUser.username}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    username: text,
                  });
                  setError({
                    ...error,
                    username: '',
                  });
                }}
                placeholder={i18n.t('enter-username')}
                icon={<AntDesign name="adduser" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.username}
                label={i18n.t('user-username')}
              />

              <Input
                value={signUpUser.password}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    password: text,
                  });
                  setError({
                    ...error,
                    password: '',
                  });
                }}
                placeholder={i18n.t('enter-password')}
                password={true}
                icon={<FontAwesome name="lock" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.password}
                label={i18n.t('user-password')}
              />

              <Input
                value={signUpUser.passwordConfirm}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    passwordConfirm: text,
                  });
                  setError({
                    ...error,
                    passwordConfirm: '',
                  });
                }}
                placeholder={i18n.t('enter-password-confirm')}
                password={true}
                icon={<FontAwesome name="lock" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.passwordConfirm}
                label={i18n.t('user-password-confirm')}
              />

              {signUpUser.type === UserTypeConstants.PHARMACY || signUpUser.type === UserTypeConstants.WAREHOUSE ? (
                <>
                  <Input
                    value={signUpUser.employeeName}
                    onTextChange={(text) => {
                      setSignUpUser({
                        ...signUpUser,
                        employeeName: text,
                      });
                      setError({
                        ...error,
                        employeeName: '',
                      });
                    }}
                    placeholder={i18n.t('enter-employee-name')}
                    icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                    border={1}
                    error={error.employeeName}
                    label={i18n.t('user-employee-name')}
                  />

                  <Input
                    value={signUpUser.certificateName}
                    onTextChange={(text) => {
                      setSignUpUser({
                        ...signUpUser,
                        certificateName: text,
                      });
                      setError({
                        ...error,
                        certificateName: '',
                      });
                    }}
                    placeholder={i18n.t('enter-certificate-name')}
                    icon={<MaterialCommunityIcons name="certificate" size={16} color={Colors.MAIN_COLOR} />}
                    border={1}
                    error={error.certificateName}
                    label={i18n.t('user-certificate-name')}
                  />
                </>
              ) : (
                <></>
              )}

              {signUpUser.type === UserTypeConstants.GUEST ? (
                <>
                  <CustomPicker
                    selectedValue={signUpUser.guestDetails.job}
                    onChange={(value) => {
                      guestTypeChangeHandler(value);
                      setError({
                        ...error,
                        job: '',
                      });
                    }}
                    data={guestJobOptions}
                    label={i18n.t('user-job')}
                    error={error.job}
                  />

                  {signUpUser.guestDetails.job === GuestJob.EMPLOYEE ? (
                    <>
                      <Input
                        value={signUpUser.guestDetails.companyName}
                        onTextChange={(text) => {
                          setSignUpUser({
                            ...signUpUser,
                            guestDetails: {
                              ...signUpUser.guestDetails,
                              companyName: text,
                            },
                          });
                          setError({
                            ...error,
                            companyName: '',
                          });
                        }}
                        placeholder={i18n.t('user-company-name')}
                        icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                        border={1}
                        error={error.companyName}
                        label={i18n.t('user-company-name')}
                      />

                      <Input
                        value={signUpUser.guestDetails.jobTitle}
                        onTextChange={(text) => {
                          setSignUpUser({
                            ...signUpUser,
                            guestDetails: {
                              ...signUpUser.guestDetails,
                              jobTitle: text,
                            },
                          });
                          setError({
                            ...error,
                            jobTitle: '',
                          });
                        }}
                        placeholder={i18n.t('user-job-title')}
                        icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                        border={1}
                        error={error.jobTitle}
                        label={i18n.t('user-job-title')}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <></>
              )}

              <Input
                value={signUpUser.email}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    email: text,
                  });
                }}
                placeholder={i18n.t('email')}
                icon={<Entypo name="email" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                label={i18n.t('user-email')}
              />

              <Input
                value={signUpUser.phone}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    phone: text,
                  });
                }}
                placeholder={i18n.t('user-phone')}
                icon={<AntDesign name="phone" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                label={i18n.t('user-phone')}
              />

              <Input
                value={signUpUser.mobile}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    mobile: text,
                  });
                  setError({
                    ...error,
                    mobile: '',
                  });
                }}
                placeholder={i18n.t('user-mobile')}
                icon={<Entypo name="mobile" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.mobile}
                label={i18n.t('user-mobile')}
              />

              <CustomPicker
                selectedValue={signUpUser.city}
                onChange={(value) => {
                  cityChangeHandler(value);
                }}
                data={citiesOptions}
                label={i18n.t('user-city')}
                error={error.city}
              />

              <Input
                value={signUpUser.addressDetails}
                onTextChange={(text) => {
                  setSignUpUser({
                    ...signUpUser,
                    addressDetails: text,
                  });
                  setError({
                    ...error,
                    addressDetails: '',
                  });
                }}
                placeholder={i18n.t('user-address-details')}
                icon={<Entypo name="address" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.addressDetails}
                label={i18n.t('user-address-details')}
              />

              {(signUpUser.type === UserTypeConstants.PHARMACY || signUpUser.type === UserTypeConstants.GUEST) && (
                <View
                  style={{
                    ...styles.chooseImageView,
                    borderColor: error.paperUrl ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
                  }}
                >
                  <TouchableOpacity style={styles.chooseImageButton} onPress={pickImage}>
                    <Text style={styles.chooseImageText}>{i18n.t(userPaperUrlLabel)}</Text>
                    {/* {signUpUser.paperUrl && <Text>{signUpUser.paperUrl}</Text>} */}
                  </TouchableOpacity>
                  {signUpUser.paperUrl && (
                    <View style={styles.chooseImageActions}>
                      <AntDesign
                        name="closecircleo"
                        size={24}
                        color={Colors.FAILED_COLOR}
                        onPress={() => {
                          setSignUpUser({
                            ...signUpUser,
                            paperUrl: null,
                          });
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
              <TouchableOpacity style={styles.button} onPress={createAccountHandler}>
                <Text style={styles.buttonText}>{i18n.t('sign-up')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        <View style={styles.signInView}>
          <Text style={styles.signInSentences}>{i18n.t('sign-in-sentence')}</Text>
          <Text
            style={styles.signInBtn}
            onPress={() => {
              signInHandler();
            }}
          >
            {i18n.t('sign-in')}
          </Text>
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

      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    minWidth: '100%',
    alignItems: 'center',
  },
  signUpView: {
    borderRadius: 15,
    width: '95%',
    minHeight: '85%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  appName: {
    fontSize: 32,
    color: '#fff',
  },
  signUpLabel: {
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bigFont: {
    fontSize: 24,
    paddingBottom: 12,
  },
  inputDiv: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 150,
    height: 100,
  },
  button: {
    backgroundColor: Colors.FAILED_COLOR,
    width: 100,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
  signInView: {
    position: 'absolute',
    top: 25,
    end: 0,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInSentences: {
    color: Colors.MAIN_COLOR,
  },
  signInBtn: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    fontSize: 16,
  },
  chooseImageView: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    width: '90%',
    borderWidth: 1,
  },
  chooseImageButton: {
    flex: 1,
    marginEnd: 10,
  },
  chooseImageText: {
    color: Colors.MAIN_COLOR,
  },
  chooseImageActions: {
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
  },
});

export default SignupScreen;
