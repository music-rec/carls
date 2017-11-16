// @flow

import * as React from 'react'
import {StyleSheet, Text, View, Platform} from 'react-native'
import * as c from '../../components/colors'
import Icon from 'react-native-vector-icons/Ionicons'
import {Touchable} from '../../components/touchable'

type ActionButtonProps = {
  icon: string,
  text: string,
  onPress: () => mixed,
}

export const ActionButton = ({icon, text, onPress}: ActionButtonProps) => (
  <Touchable style={styles.button} hightlight={false} onPress={onPress}>
    <View style={styles.wrapper}>
      <Icon style={styles.icon} name={icon} />
      <Text style={styles.action}>{text}</Text>
    </View>
  </Touchable>
)

export const CallButton = ({onPress}: {onPress: () => mixed}) => (
  <SmallActionButton
    icon={Platform.OS === 'ios' ? 'ios-call' : 'android-call'}
    onPress={onPress}
  />
)

export const ShowCalendarButton = ({onPress}: {onPress: () => mixed}) => (
  <SmallActionButton
    icon={Platform.OS === 'ios' ? 'ios-calendar' : 'android-calendar'}
    onPress={onPress}
  />
)

type SmallActionButtonProps = {
  icon: string,
  onPress: () => mixed,
}

const SmallActionButton = ({icon, onPress}: SmallActionButtonProps) => (
  <Touchable style={styles.smallButton} hightlight={false} onPress={onPress}>
    <View style={styles.wrapper}>
      <Icon style={styles.icon} name={icon} />
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: c.denim,
    width: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  smallButton: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: c.denim,
    width: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
  },
  icon: {
    color: c.white,
    fontSize: 30,
  },
  action: {
    color: c.white,
    paddingLeft: 10,
    paddingTop: 7,
    fontWeight: '900',
  },
})
