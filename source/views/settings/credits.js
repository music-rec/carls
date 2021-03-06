// @flow
import * as React from 'react'
import * as c from '../components/colors'
import {data as credits} from '../../../docs/credits.json'
import glamorous from 'glamorous-native'
import {Platform} from 'react-native'
import {iOSUIKit, material} from 'react-native-typography'
import {AppLogo} from '../components/logo'
import {Touchable} from '../components/touchable'
import {connect} from 'react-redux'
import {showEasterEgg} from '../../flux/parts/settings'
import type {TopLevelViewPropsType} from '../types'
import type {ReduxState} from '../../flux'

type ReduxStateProps = {
	easterEggEnabled: boolean,
}

type ReduxDispatchProps = {
	showEasterEgg: () => any,
}

type Props = TopLevelViewPropsType & ReduxStateProps & ReduxDispatchProps

const Container = glamorous.scrollView({
	backgroundColor: c.white,
	paddingHorizontal: 5,
	paddingVertical: 10,
})

const Title = glamorous.text({
	textAlign: 'center',
	marginTop: 10,
	marginBottom: 5,
	...Platform.select({
		ios: iOSUIKit.largeTitleEmphasizedObject,
		android: material.headlineObject,
	}),
})

const Heading = glamorous(Title)({
	...Platform.select({
		ios: iOSUIKit.subheadEmphasizedObject,
		android: material.titleObject,
	}),
})

const About = glamorous.text({
	...Platform.select({
		ios: iOSUIKit.bodyObject,
		android: material.body1Object,
	}),
	paddingHorizontal: 25,
	paddingTop: 10,
})

const Contributors = glamorous(About)({
	...Platform.select({
		ios: iOSUIKit.footnoteEmphasizedObject,
		android: material.body1Object,
	}),
	textAlign: 'center',
})

const formatPeopleList = arr => arr.map(w => w.replace(' ', ' ')).join(' • ')

function CreditsView(props: Props) {
	return (
		<Container contentInsetAdjustmentBehavior="automatic">
			<Touchable highlight={false} onPress={props.showEasterEgg}>
				<AppLogo />
			</Touchable>

			<Title>{credits.name}</Title>
			<About>{credits.content}</About>

			<Heading>Contributors</Heading>
			<Contributors>{formatPeopleList(credits.contributors)}</Contributors>

			<Heading>Acknowledgements</Heading>
			<Contributors>{formatPeopleList(credits.acknowledgements)}</Contributors>
		</Container>
	)
}

CreditsView.navigationOptions = {
	title: 'Credits',
}

function mapState(state: ReduxState): ReduxStateProps {
	return {
		easterEggEnabled: state.settings ? state.settings.easterEggEnabled : false,
	}
}

function mapDispatch(dispatch): ReduxDispatchProps {
	return {
		showEasterEgg: () => dispatch(showEasterEgg()),
	}
}

export default connect(mapState, mapDispatch)(CreditsView)
