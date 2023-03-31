import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import i18n from '../i18n';
import { Colors } from '../utils/constants';
import CheckBox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Fontisto } from '@expo/vector-icons';

const ChooseDateBottomSheet = ({ cancelAction, header, message, handler, withTime }) => {
  const [disableDate, setDisableDate] = useState(true);
  const [disableTime, setDisableTime] = useState(true);

  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate ? selectedDate : date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatepickerHandler = () => {
    if (!disableDate) setShowDatePicker(true);
  };

  const formatDate = (d) => {
    if (d) {
      let dd = String(d.getDate()).padStart(2, '0');
      let mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = d.getFullYear();

      let selectedDate = dd + '/' + mm + '/' + yyyy;
      return selectedDate;
    }
  };

  const okHandler = () => {
    handler(
      !disableDate ? date : undefined,
      !disableTime ? `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}` : undefined,
    );
    cancelAction();
  };

  const changeDateVisibiliyHandlder = () => {
    setDisableDate(!disableDate);
  };

  const changeMinutesHandler = (keyValue) => {
    const value = Number(minutes + keyValue);
    if (Number.isNaN(value)) {
      setMinutes('');
      return;
    }
    if (value > 59) setMinutes(keyValue + '');
    else setMinutes(value + '');
  };

  const changeHoursHandler = (keyValue) => {
    const value = Number(hours + keyValue);
    if (Number.isNaN(value)) {
      setHours('');
      return;
    }
    if (value > 23) setHours(keyValue + '');
    else setHours(value + '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t(header)}</Text>
      <View style={styles.body}>
        <Text style={styles.message}>{i18n.t(message)}</Text>
        <View style={styles.row}>
          <CheckBox value={!disableDate} onValueChange={changeDateVisibiliyHandlder} />
          <Text style={styles.label}>{i18n.t('date-label')}</Text>
          {!disableDate && (
            <>
              <Text style={{ color: Colors.MAIN_COLOR, textAlign: 'left', marginEnd: 10 }}>{formatDate(date)}</Text>
              <Fontisto name="date" size={24} color={Colors.MAIN_COLOR} onPress={showDatepickerHandler} />
              {showDatePicker && (
                <DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={onChange} />
              )}
            </>
          )}
        </View>

        {withTime && (
          <View style={styles.row}>
            <CheckBox value={!disableTime} onValueChange={() => setDisableTime(!disableTime)} />
            <Text style={styles.label}>{i18n.t('time-label')}</Text>
            {!disableTime && (
              <>
                <TextInput
                  style={styles.input}
                  value={minutes}
                  numeric
                  keyboardType={'numeric'}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => changeMinutesHandler(keyValue)}
                />
                <Text>:</Text>
                <TextInput
                  style={styles.input}
                  value={hours}
                  numeric
                  keyboardType={'numeric'}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => changeHoursHandler(keyValue)}
                />
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={okHandler}
          style={{ ...styles.actionView, flex: 3, backgroundColor: Colors.SUCCEEDED_COLOR }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t('ok-label')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={cancelAction}
          style={{ ...styles.actionView, flex: 1, backgroundColor: Colors.FAILED_COLOR }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    flexDirection: 'column',
  },
  actions: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionView: {
    flex: 3,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 30,
  },
  message: {
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    minWidth: 75,
    marginStart: 10,
    color: Colors.DARK_COLOR,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.MAIN_COLOR,
    width: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
  },
});

export default ChooseDateBottomSheet;
