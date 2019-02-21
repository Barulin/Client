/*!
 * V4Fire Client Core
 * https://github.com/V4Fire/Client
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Client/blob/master/LICENSE
 */

import iBlock, { ModsDecl, ModEvent } from 'super/i-block/i-block';

export default abstract class iAccess {
	/**
	 * Disables the component
	 * @param component
	 */
	static async disable(component: iBlock): Promise<boolean> {
		return component.setMod('disabled', true);
	}

	/**
	 * Enables the component
	 * @param component
	 */
	static async enable(component: iBlock): Promise<boolean> {
		return component.setMod('disabled', false);
	}

	/**
	 * Sets focus for the component
	 * @param component
	 */
	static async focus(component: iBlock): Promise<boolean> {
		return component.setMod('focused', true);
	}

	/**
	 * Unsets focus for the component
	 * @param component
	 */
	static async blur(component: iBlock): Promise<boolean> {
		return component.setMod('focused', false);
	}

	/**
	 * Initializes modifiers event listeners
	 *
	 * @emits enable()
	 * @emits disable()
	 *
	 * @emits focus()
	 * @emits blur()
	 *
	 * @param component
	 */
	static initModEvents(component: iBlock): void {
		const
			// @ts-ignore
			{localEvent: $e, async: $a} = component;

		$e.on('block.mod.*.disabled.*', (e: ModEvent) => {
			if (e.value === 'false' || e.type === 'remove') {
				$a.off({group: 'blockOnDisable'});
				component.emit('enable');

			} else {
				component.emit('disable');

				const handler = (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
				};

				$a.on(component.$el, 'click mousedown touchstart keydown input change scroll', handler, {
					group: 'blockOnDisable',
					options: {
						capture: true
					}
				});
			}
		});

		$e.on('block.mod.*.focused.*', (e: ModEvent) => {
			component.emit(e.value === 'false' || e.type === 'remove' ? 'blur' : 'focus');
		});
	}

	/**
	 * Accessibility modifiers
	 */
	static readonly mods: ModsDecl = {
		disabled: [
			'true',
			'false'
		],

		focused: [
			'true',
			'false'
		]
	};

	/**
	 * Disables the component
	 */
	abstract async disable(): Promise<boolean>;

	/**
	 * Enables the component
	 */
	abstract async enable(): Promise<boolean>;

	/**
	 * Sets focus for the component
	 */
	abstract async focus(): Promise<boolean> ;

	/**
	 * Unsets focus for the component
	 */
	abstract async blur(): Promise<boolean>;
}
