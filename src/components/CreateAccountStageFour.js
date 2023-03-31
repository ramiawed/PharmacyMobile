import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import i18n from '../i18n';

// components
import SignupStagesActions from './SignupStagesActions';
import * as ImagePicker from 'expo-image-picker';
import CustomPicker from './CustomPicker';
import Input from './Input';

// constants
import { Colors, GuestJob, UserTypeConstants } from '../utils/constants';

// icons
import { MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';

const CreateAccountStageFour = ({ userType, setStage, setPrevStage, obj, setObj }) => {
  const userPaperUrlLabel =
    userType === UserTypeConstants.GUEST ? 'choose-paper-url-guest' : 'choose-paper-url-pharmacy';

  // guest options and its change handler
  const guestJobOptions = [
    { value: GuestJob.STUDENT, label: i18n.t('student') },
    { value: GuestJob.PHARMACIST, label: i18n.t('pharmacist') },
    { value: GuestJob.EMPLOYEE, label: i18n.t('employee') },
  ];

  const [error, setError] = useState({
    employeeName: '',
    certificateName: '',
    paperUrl: null,
    guestDetails: {
      job: '',
      companyName: '',
      jobTitle: '',
    },
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

  const guestDetailsInputChangeHandler = (key, value) => {
    setObj({
      ...obj,
      guestDetails: {
        ...obj.guestDetails,
        [key]: value,
      },
    });

    setError({
      ...error,
      guestDetails: {
        ...error.guestDetails,
        [key]: '',
      },
    });
  };

  const nextStageHandler = () => {
    let hasError = false;
    let errorObj = {
      companyName: '',
      employeeName: '',
      certificateName: '',
      guestDetails: {
        job: '',
        companyName: '',
        jobTitle: '',
      },
    };

    if (userType === UserTypeConstants.PHARMACY || userType === UserTypeConstants.WAREHOUSE) {
      if (obj.employeeName.trim().length === 0) {
        hasError = true;
        errorObj = {
          ...errorObj,
          employeeName: 'enter employee name',
        };
      }

      if (obj.certificateName.trim().length === 0) {
        hasError = true;
        errorObj = {
          ...errorObj,
          certificateName: 'enter certificate name',
        };
      }
    }

    if (userType === UserTypeConstants.GUEST) {
      if (obj.guestDetails.job === GuestJob.EMPLOYEE) {
        if (obj.guestDetails.jobTitle.trim().length === 0) {
          hasError = true;
          errorObj = {
            ...errorObj,
            guestDetails: {
              ...errorObj.guestDetails,
              jobTitle: 'enter job title',
            },
          };
        }

        if (obj.guestDetails.companyName.trim().length === 0) {
          hasError = true;
          errorObj = {
            ...errorObj,
            guestDetails: {
              ...errorObj.guestDetails,
              companyName: 'enter company name',
            },
          };
        }
      }

      // job is required
      if (obj.guestDetails.job === '') {
        hasError = true;
        errorObj = {
          ...errorObj,
          guestDetails: {
            ...errorObj.guestDetails,
            job: 'choose job',
          },
        };
      }
    }

    if (userType === UserTypeConstants.PHARMACY || userType === UserTypeConstants.GUEST) {
      if (obj.paperUrl === null || obj.paperUrl?.length === 0 || !obj.paperUrl) {
        hasError = true;
        errorObj = {
          ...errorObj,
          paperUrl: 'enter-paper-url',
        };
      }

      // if (user.paperUrl !== null && user.paperUrl.size > 5242880) {
      //   errorObj["paperUrl"] = "paper-url-size-error";
      // }
    }

    if (hasError) {
      setError(errorObj);
      return;
    }

    // setPrevStage(4);
    setStage(5);
  };

  const prevStageHandler = () => {
    // setPrevStage(4);
    setStage(3);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setObj({
        ...obj,
        paperUrl: result,
      });
      setError({
        ...error,
        paperUrl: '',
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputsView}>
          {userType === UserTypeConstants.PHARMACY || userType === UserTypeConstants.WAREHOUSE ? (
            <>
              <Input
                value={obj.employeeName}
                onTextChange={(text) => {
                  inputChangeHandler('employeeName', text);
                }}
                placeholder={i18n.t('enter employee name')}
                icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.employeeName}
                label={i18n.t('user employee name')}
              />
              <Input
                value={obj.certificateName}
                onTextChange={(text) => {
                  inputChangeHandler('certificateName', text);
                }}
                placeholder={i18n.t('enter certificate name')}
                icon={<MaterialCommunityIcons name="certificate" size={16} color={Colors.MAIN_COLOR} />}
                border={1}
                error={error.certificateName}
                label={i18n.t('user certificate name')}
              />
            </>
          ) : (
            <></>
          )}

          {userType === UserTypeConstants.GUEST ? (
            <>
              <CustomPicker
                selectedValue={obj.guestDetails.job}
                onChange={(value) => {
                  setObj({
                    ...obj,
                    guestDetails: {
                      ...obj.guestDetails,
                      job: value,
                    },
                  });
                  setError({
                    ...error,
                    guestDetails: {
                      ...obj.guestDetails,
                      job: '',
                    },
                  });
                }}
                data={guestJobOptions}
                label={i18n.t('user job')}
                error={error.job}
              />

              {obj.guestDetails.job === GuestJob.EMPLOYEE ? (
                <>
                  <Input
                    value={obj.guestDetails.companyName}
                    onTextChange={(text) => {
                      guestDetailsInputChangeHandler('companyName', text);
                    }}
                    placeholder={i18n.t('user-company-name')}
                    icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                    border={1}
                    error={error.guestDetails.companyName}
                    label={i18n.t('user-company-name')}
                  />

                  <Input
                    value={obj.guestDetails.jobTitle}
                    onTextChange={(text) => {
                      guestDetailsInputChangeHandler('jobTitle', text);
                    }}
                    placeholder={i18n.t('user job title')}
                    icon={<FontAwesome name="user-o" size={16} color={Colors.MAIN_COLOR} />}
                    border={1}
                    error={error.guestDetails.jobTitle}
                    label={i18n.t('user job title')}
                  />
                </>
              ) : null}
            </>
          ) : (
            <></>
          )}

          {(userType === UserTypeConstants.PHARMACY || userType === UserTypeConstants.GUEST) && (
            <View
              style={{
                ...styles.chooseImageView,
                borderColor: error.paperUrl ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
              }}
            >
              <TouchableOpacity style={styles.chooseImageButton} onPress={pickImage}>
                <Text style={styles.chooseImageText}>
                  {obj.paperUrl
                    ? obj.paperUrl.uri.split('/')[obj.paperUrl.uri.split('/').length - 1]
                    : i18n.t(userPaperUrlLabel)}
                </Text>
                <Text style={styles.chooseImageText}>{i18n.t('press-to-choose-image')}</Text>
              </TouchableOpacity>
              {obj.paperUrl && (
                <View style={styles.chooseImageActions}>
                  <Feather name="check-circle" size={24} color={Colors.SUCCEEDED_COLOR} />
                </View>
              )}
            </View>
          )}
        </View>
        <SignupStagesActions stage={4} prevHandler={prevStageHandler} nextHandler={nextStageHandler} />
      </View>
    </>
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
  chooseImageView: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
  },
  chooseImageButton: {
    flex: 1,
    marginEnd: 10,
  },
  chooseImageText: {
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
  chooseImageActions: {
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
  },
});

export default CreateAccountStageFour;
