// @flow

import * as React from 'react'
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	RefreshControl,
	Alert,
} from 'react-native'
import {TabBarIcon} from '../components/tabbar-icon'
import {connect} from 'react-redux'
import {Cell, TableView, Section} from 'react-native-tableview-simple'
import {
	hasSeenAcknowledgement,
	type LoginStateType,
} from '../../flux/parts/settings'
import {updateBalances} from '../../flux/parts/balances'
import {type ReduxState} from '../../flux'
import delay from 'delay'
import * as c from '../components/colors'
import type {TopLevelViewPropsType} from '../types'

const DISCLAIMER = 'This data may be outdated or otherwise inaccurate.'
const LONG_DISCLAIMER =
	'This data may be inaccurate.\nBon Appétit is always right.\nThis app is unofficial.'

type ReactProps = TopLevelViewPropsType

type ReduxStateProps = {
	dining: ?string,
	schillers: ?string,
	print: ?string,
	weeklyMeals: ?string,
	dailyMeals: ?string,
	guestSwipes: ?string,
	loginState: LoginStateType,
	message: ?string,
	alertSeen: boolean,
}

type ReduxDispatchProps = {
	hasSeenAcknowledgement: () => any,
	updateBalances: boolean => any,
}

type Props = ReactProps & ReduxStateProps & ReduxDispatchProps

type State = {
	loading: boolean,
}

class BalancesView extends React.PureComponent<Props, State> {
	static navigationOptions = {
		tabBarLabel: 'Balances',
		tabBarIcon: TabBarIcon('card'),
	}

	state = {
		loading: false,
	}

	componentDidMount() {
		// calling "refresh" here, to make clear to the user
		// that the data is being updated
		this.refresh()

		if (!this.props.alertSeen) {
			Alert.alert('', LONG_DISCLAIMER, [
				{text: 'I Disagree', onPress: this.goBack, style: 'cancel'},
				{text: 'Okay', onPress: this.props.hasSeenAcknowledgement},
			])
		}
	}

	refresh = async () => {
		let start = Date.now()
		this.setState(() => ({loading: true}))

		await this.fetchData()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = Date.now() - start
		await delay(500 - elapsed)

		this.setState(() => ({loading: false}))
	}

	fetchData = async () => {
		await this.props.updateBalances(true)
	}

	openSettings = () => {
		this.props.navigation.navigate('SettingsView')
	}

	goBack = () => {
		this.props.navigation.goBack(null)
	}

	render() {
		let {dining, schillers, dailyMeals, weeklyMeals, guestSwipes} = this.props
		let {loading} = this.state

		return (
			<ScrollView
				contentContainerStyle={styles.stage}
				refreshControl={
					<RefreshControl
						onRefresh={this.refresh}
						refreshing={this.state.loading}
					/>
				}
			>
				<TableView>
					<Section footer={DISCLAIMER} header="BALANCES">
						<View style={styles.balancesRow}>
							<FormattedValueCell
								formatter={getValueOrNa}
								indeterminate={loading}
								label="Schillers"
								value={schillers}
							/>

							<FormattedValueCell
								formatter={getValueOrNa}
								indeterminate={loading}
								label="Dining"
								value={dining}
							/>
						</View>
					</Section>

					<Section footer={DISCLAIMER} header="MEAL PLAN (REMAINING)">
						<View style={styles.balancesRow}>
							<FormattedValueCell
								formatter={getValueOrNa}
								indeterminate={loading}
								label="Daily Meals"
								value={dailyMeals}
							/>

							<FormattedValueCell
								formatter={getValueOrNa}
								indeterminate={loading}
								label="Weekly Meals"
								value={weeklyMeals}
							/>

							<FormattedValueCell
								formatter={getValueOrNa}
								indeterminate={loading}
								label="Guest Swipes"
								style={styles.finalCell}
								value={guestSwipes}
							/>
						</View>
					</Section>

					{(this.props.loginState !== 'checking' &&
						this.props.loginState !== 'logged-in') ||
					this.props.message ? (
						<Section footer="You'll need to log in again so we can update these numbers.">
							{this.props.loginState !== 'logged-in' ? (
								<Cell
									accessory="DisclosureIndicator"
									cellStyle="Basic"
									onPress={this.openSettings}
									title="Log in with Carleton"
								/>
							) : null}

							{this.props.message ? (
								<Cell cellStyle="Basic" title={this.props.message} />
							) : null}
						</Section>
					) : null}
				</TableView>
			</ScrollView>
		)
	}
}

function mapState(state: ReduxState): ReduxStateProps {
	return {
		schillers: state.balances ? state.balances.schillersBalance : null,
		dining: state.balances ? state.balances.diningBalance : null,
		print: state.balances ? state.balances.printBalance : null,
		weeklyMeals: state.balances ? state.balances.mealsRemainingThisWeek : null,
		dailyMeals: state.balances ? state.balances.mealsRemainingToday : null,
		guestSwipes: state.balances ? state.balances.guestSwipesCount : null,
		message: state.balances ? state.balances.balancesErrorMessage : null,
		alertSeen: state.settings ? state.settings.unofficiallyAcknowledged : false,

		loginState: state.settings ? state.settings.loginState : 'logged-out',
	}
}

function mapDispatch(dispatch): ReduxDispatchProps {
	return {
		updateBalances: force => dispatch(updateBalances(force)),
		hasSeenAcknowledgement: () => dispatch(hasSeenAcknowledgement()),
	}
}

const ConnectedBalancesView = connect(mapState, mapDispatch)(BalancesView)

export default ConnectedBalancesView

let cellMargin = 10
let cellSidePadding = 10
let cellEdgePadding = 10

let styles = StyleSheet.create({
	stage: {
		backgroundColor: c.iosLightBackground,
		paddingTop: 20,
		paddingBottom: 20,
	},

	common: {
		backgroundColor: c.white,
	},

	balances: {
		borderRightWidth: StyleSheet.hairlineWidth,
		borderRightColor: c.iosSeparator,
	},

	finalCell: {
		borderRightWidth: 0,
	},

	balancesRow: {
		flexDirection: 'row',
		marginTop: 0,
		marginBottom: -10,
	},

	rectangle: {
		height: 88,
		flex: 1,
		alignItems: 'center',
		paddingTop: cellSidePadding,
		paddingBottom: cellSidePadding,
		paddingRight: cellEdgePadding,
		paddingLeft: cellEdgePadding,
		marginBottom: cellMargin,
	},

	// Text styling
	financialText: {
		paddingTop: 8,
		color: c.iosDisabledText,
		textAlign: 'center',
		fontWeight: '200',
		fontSize: 23,
	},
	rectangleButtonText: {
		paddingTop: 15,
		color: c.black,
		textAlign: 'center',
		fontSize: 16,
	},
})

export function BigBalancesView(props: TopLevelViewPropsType) {
	return <ConnectedBalancesView navigation={props.navigation} />
}
BigBalancesView.navigationOptions = {
	title: 'Balances',
}

function getValueOrNa(value: ?string): string {
	// eslint-disable-next-line no-eq-null
	if (value == null) {
		return 'N/A'
	}
	return value
}

function FormattedValueCell(props: {
	indeterminate: boolean,
	label: string,
	value: ?string,
	style?: any,
	formatter: (?string) => string,
}) {
	let {indeterminate, label, value, style, formatter} = props
	return (
		<View style={[styles.rectangle, styles.common, styles.balances, style]}>
			<Text
				autoAdjustsFontSize={true}
				selectable={true}
				style={styles.financialText}
			>
				{indeterminate ? '…' : formatter(value)}
			</Text>
			<Text autoAdjustsFontSize={true} style={styles.rectangleButtonText}>
				{label}
			</Text>
		</View>
	)
}
