import { ExpoPushReporter } from './reporters/expo-push.js'
import safari from './safari.js'
import { getPropsTask } from './safari/props.js'
import { daily } from './scheduler.js'
import init from './init.js'

safari.addReporter(new ExpoPushReporter(init.expo));

// check the blockchain 3 times a day for new proposals
daily('08:00:00', '14:00:00', '20:00:00')(getPropsTask, { runNow: true });
