/**
 * @module ol/interaction/KeyboardPan
 */
import {inherits} from '../index.js';
import {rotate as rotateCoordinate} from '../coordinate.js';
import EventType from '../events/EventType.js';
import KeyCode from '../events/KeyCode.js';
import {noModifierKeys, targetNotEditable} from '../events/condition.js';
import Interaction from '../interaction/Interaction.js';

/**
 * @classdesc
 * Allows the user to pan the map using keyboard arrows.
 * Note that, although this interaction is by default included in maps,
 * the keys can only be used when browser focus is on the element to which
 * the keyboard events are attached. By default, this is the map div,
 * though you can change this with the `keyboardEventTarget` in
 * {@link ol.Map}. `document` never loses focus but, for any other element,
 * focus will have to be on, and returned to, this element if the keys are to
 * function.
 * See also {@link ol.interaction.KeyboardZoom}.
 *
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @param {olx.interaction.KeyboardPanOptions=} opt_options Options.
 * @api
 */
const KeyboardPan = function(opt_options) {

  Interaction.call(this, {
    handleEvent: KeyboardPan.handleEvent
  });

  const options = opt_options || {};

  /**
   * @private
   * @param {ol.MapBrowserEvent} mapBrowserEvent Browser event.
   * @return {boolean} Combined condition result.
   */
  this.defaultCondition_ = function(mapBrowserEvent) {
    return noModifierKeys(mapBrowserEvent) &&
      targetNotEditable(mapBrowserEvent);
  };

  /**
   * @private
   * @type {ol.EventsConditionType}
   */
  this.condition_ = options.condition !== undefined ?
    options.condition : this.defaultCondition_;

  /**
   * @private
   * @type {number}
   */
  this.duration_ = options.duration !== undefined ? options.duration : 100;

  /**
   * @private
   * @type {number}
   */
  this.pixelDelta_ = options.pixelDelta !== undefined ?
    options.pixelDelta : 128;

};

inherits(KeyboardPan, Interaction);

/**
 * Handles the {@link ol.MapBrowserEvent map browser event} if it was a
 * `KeyEvent`, and decides the direction to pan to (if an arrow key was
 * pressed).
 * @param {ol.MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {ol.interaction.KeyboardPan}
 * @api
 */
KeyboardPan.handleEvent = function(mapBrowserEvent) {
  let stopEvent = false;
  if (mapBrowserEvent.type == EventType.KEYDOWN) {
    const keyEvent = mapBrowserEvent.originalEvent;
    const keyCode = keyEvent.keyCode;
    if (this.condition_(mapBrowserEvent) &&
        (keyCode == KeyCode.DOWN ||
        keyCode == KeyCode.LEFT ||
        keyCode == KeyCode.RIGHT ||
        keyCode == KeyCode.UP)) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      const mapUnitsDelta = view.getResolution() * this.pixelDelta_;
      let deltaX = 0, deltaY = 0;
      if (keyCode == KeyCode.DOWN) {
        deltaY = -mapUnitsDelta;
      } else if (keyCode == KeyCode.LEFT) {
        deltaX = -mapUnitsDelta;
      } else if (keyCode == KeyCode.RIGHT) {
        deltaX = mapUnitsDelta;
      } else {
        deltaY = mapUnitsDelta;
      }
      const delta = [deltaX, deltaY];
      rotateCoordinate(delta, view.getRotation());
      Interaction.pan(view, delta, this.duration_);
      mapBrowserEvent.preventDefault();
      stopEvent = true;
    }
  }
  return !stopEvent;
};
export default KeyboardPan;
