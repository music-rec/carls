// @flow

import {TabNavigator} from '../components/tabbed-view'

import BalancesView from './balances'
import {StudentWorkView} from './student-work-carls'
import {TheHubView} from './hub'

export default TabNavigator(
	{
		BalancesView: {screen: BalancesView},
		TheHubView: {screen: TheHubView},
		StudentWorkView: {screen: StudentWorkView},
	},
	{
		navigationOptions: {
			title: 'OneCard',
		},
	},
)
