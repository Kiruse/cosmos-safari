import { ExpoPushReporter } from './reporters/expo-push.js'
import safari from './safari.js'
import { getPropsTask } from './safari/props.js'
import { interval } from './scheduler.js'
import init from './init.js'

safari.addReporter(new ExpoPushReporter(init.expo));

// check the blockchain every hour for new proposals
interval(3600, getPropsTask, { runNow: true });
