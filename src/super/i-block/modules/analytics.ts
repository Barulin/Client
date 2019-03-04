/*!
 * V4Fire Client Core
 * https://github.com/V4Fire/Client
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Client/blob/master/LICENSE
 */

//#if runtime has core/analytics
import * as analytics from 'core/analytics';
//#endif

import iBlock from 'super/i-block/i-block';

export default class Analytics {
	/**
	 * iBlock instance
	 */
	protected readonly component: iBlock;

	/**
	 * @param component - component instance
	 */
	constructor(component: iBlock) {
		this.component = component;
	}

	/**
	 * Sends an analytic event with the specified parameters
	 *
	 * @param event - event name
	 * @param [details] - event details
	 */
	protected sendEvent(event: string, details: Dictionary = {}): void {
		//#if runtime has core/analytics
		analytics.send(event, details);
		//#endif
	}
}