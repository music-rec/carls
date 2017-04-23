// @flow

import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {buildingImages} from '../../../images/building-images'
import type {BuildingType, DayOfWeekEnumType} from './types'
import type momentT from 'moment'
import moment from 'moment-timezone'
import {TableView, Section, Cell} from 'react-native-tableview-simple'
import ParallaxView from 'react-native-parallax-view'
import * as c from '../components/colors'
import {
  normalizeBuildingSchedule,
  formatBuildingTimes,
  summarizeDays,
  getShortBuildingStatus,
  isBuildingOpenAtMoment,
} from './building-hours-helpers'

const CENTRAL_TZ = 'America/Winnipeg'
const transparentPixel = require('../../../images/transparent.png')

const styles = StyleSheet.create({
  title: {
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  name: {
    textAlign: 'center',
    color: c.black,
    fontSize: 32,
    fontWeight: '300',
  },
  subtitle: {
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  subtitleText: {
    fontSize: 18,
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'center',
  },
  badgeText: {
    color: c.white,
    fontSize: 18,
  },
  scrollableStyle: {
    backgroundColor: c.iosLightBackground,
  },
  bold: {
    fontWeight: '600',
  },
})

export class BuildingHoursDetailView extends React.Component {
  state: {intervalId: number, now: momentT} = {
    intervalId: 0,
    // now: moment.tz('Wed 7:25pm', 'ddd h:mma', null, CENTRAL_TZ),
    now: moment.tz(CENTRAL_TZ),
  }

  componentWillMount() {
    // This updates the screen every ten seconds, so that the building
    // info statuses are updated without needing to leave and come back.
    this.setState({intervalId: setInterval(this.updateTime, 10000)})
  }

  componentWillUnmount() {
    clearTimeout(this.state.intervalId)
  }

  props: BuildingType

  updateTime = () => {
    this.setState({now: moment.tz(CENTRAL_TZ)})
  }

  render() {
    const bgColors = {
      Open: c.moneyGreen,
      Closed: c.salmon,
    }

    const headerImage = this.props.image
      ? buildingImages[this.props.image]
      : transparentPixel
    const openStatus = getShortBuildingStatus(this.props, this.state.now)
    const schedules = normalizeBuildingSchedule(this.props, this.state.now)
    const dayOfWeek = ((this.state.now.format('dd'): any): DayOfWeekEnumType)

    const abbr = this.props.abbreviation
      ? <Text style={styles.abbr}> ({this.props.abbreviation})</Text>
      : null
    const title = (
      <Text selectable={true} style={styles.name}>{this.props.name}{abbr}</Text>
    )
    const subtitle = this.props.subtitle
      ? <View style={styles.subtitle}>
          <Text selectable={true} style={[styles.name, styles.subtitleText]}>
            {this.props.subtitle}
          </Text>
        </View>
      : null

    return (
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={100}
        scrollableViewStyle={styles.scrollableStyle}
      >
        <View>
          <View style={styles.title}>{title}</View>
          {subtitle}

          <View
            style={[
              styles.badge,
              {backgroundColor: bgColors[openStatus] || c.goldenrod},
            ]}
          >
            <Text selectable={true} style={styles.badgeText}>{openStatus}</Text>
          </View>

          <TableView>
            {schedules.map(set => (
              <Section
                key={set.title}
                header={set.title.toUpperCase()}
                footer={set.notes}
              >
                {set.hours.map((schedule, i) => {
                  let isActiveSchedule =
                    set.isPhysicallyOpen !== false &&
                    schedule.days.includes(dayOfWeek) &&
                    isBuildingOpenAtMoment(schedule, this.state.now)

                  return (
                    <Cell
                      key={i}
                      cellStyle="RightDetail"
                      title={summarizeDays(schedule.days)}
                      titleTextStyle={isActiveSchedule ? styles.bold : null}
                      detail={formatBuildingTimes(schedule, this.state.now)}
                      detailTextStyle={isActiveSchedule ? styles.bold : null}
                    />
                  )
                })}
              </Section>
            ))}
          </TableView>
        </View>
      </ParallaxView>
    )
  }
}
