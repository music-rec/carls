// @flow
import React from 'react'
import {Text, ScrollView, StyleSheet} from 'react-native'
import moment from 'moment-timezone'
import {fastGetTrimmedText} from '../../lib/html'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import type {EventType} from './types'

const styles = StyleSheet.create({
  chunk: {
    paddingVertical: 10,
  },
})

function display(title: string, data: string) {
  return data.trim()
    ? <Section header={title}>
        <Cell
          cellContentView={
            <Text selectable={true} style={styles.chunk}>
              {data}
            </Text>
          }
        />
      </Section>
    : null
}

function displayTimes(title: string, event: EventType) {
  const eventLength = moment
    .duration(event.endTime.diff(event.startTime))
    .asHours()

  const allDay = eventLength === 24
  const multiDay = event.startTime.dayOfYear() !== event.endTime.dayOfYear()
  const sillyZeroLength = event.startTime.isSame(event.endTime, 'minute')

  if (allDay) {
    return display(title, 'All-Day')
  }

  let start, end
  if (event.isOngoing) {
    start = event.startTime.format('MMM. D')
    end = event.endTime.format('MMM. D')
  } else if (multiDay) {
    start = event.startTime.format('h:mm A')
    end = `${event.endTime.format('MMM. D h:mm A')}`
  } else if (sillyZeroLength) {
    start = event.startTime.format('h:mm A')
    end = '???'
  } else {
    start = event.startTime.format('h:mm A')
    end = event.endTime.format('h:mm A')
  }

  return display(title, start + ' — ' + end)
}

export function EventDetail({event}: {event: EventType}) {
  let title = fastGetTrimmedText(event.summary || '')
  let summary = fastGetTrimmedText(event.extra.data.description || '')
  let location = fastGetTrimmedText(event.location || '')

  return (
    <ScrollView>
      <TableView>
        {display('EVENT', title)}
        {displayTimes('TIME', event)}
        {display('LOCATION', location)}
        {display('DESCRIPTION', summary)}
      </TableView>
    </ScrollView>
  )
}