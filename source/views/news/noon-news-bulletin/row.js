// @flow

import * as React from 'react'
import type {NewsBulletinType} from './types'
import {ListRow, Title} from '../../components/list'
import {fastGetTrimmedText} from '../../../lib/html'
import {AllHtmlEntities} from 'html-entities'

type Props = {
	bulletin: NewsBulletinType,
}

const entities = new AllHtmlEntities()

export class NoonNewsRowView extends React.PureComponent<Props> {
	render() {
		const {bulletin} = this.props

		return (
			<ListRow arrowPosition="none">
				<Title>
					{entities.decode(fastGetTrimmedText(bulletin.description))}
				</Title>
			</ListRow>
		)
	}
}
