(function () {

    'use strict';
    // Create my namespace, if it doesn't exist
    if (!window.Plutonium) {
        window.Plutonium = {};
    }

    Plutonium.NOTIFICATION_EVENT_NAME = 'plutonium-notification-event'
    Plutonium.NAVIGATION_EVENT_NAME = 'plutonium-navigation-event'
    Plutonium.MODAL_EVENT_NAME = 'plutonium-modal-event'

    function isNone(o) {
        return (o === undefined || o === null);
    }

    /**
     * Element class mixin that provides meta-programming for Polymer's template
     * binding and data observation (collectively, "property effects") system.
     *
     * This mixin uses provides the following key static methods for adding
     * property effects to an element class:
     * - `addPropertyEffect`
     * - `bindTemplate`
     *
     * Each method creates one or more property accessors, along with metadata
     *
     * @mixinFunction
     * @polymer
     * @appliesMixin Polymer.TemplateStamp
     * @appliesMixin Polymer.PropertyAccessors
     * @memberof Polymer
     * @summary Element class mixin that provides meta-programming for Polymer's
     * template binding and data observation system.
     */

    const guid = () => {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
    };
    Plutonium.guid = guid;

    const toCamelCase = (token) => {
        return token
            .replace(/\s(.)/g, function ($1) {
                return $1.toUpperCase();
            })
            .replace(/\s/g, '')
            .replace(/^(.)/, function ($1) {
                return $1.toLowerCase();
            });
    };

    const styleHyphenFormat = (token) => {
        return token.replace(/[A-Z]/g, function (match, offset, string) {
            return (offset > 0 ? '-' : '') + match.toLowerCase();
        });
    };

    const tokenize = (token) => {
        return token
            .replace(/ó/g, 'o')
            .replace(/ö/g, 'o')
            .replace(/ő/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/ü/g, 'u')
            .replace(/ű/g, 'u')
            .replace(/í/g, 'i')
            .replace(/é/g, 'e')
            .replace(/á/g, 'a')
            // .replace(/\w+/g, '_')
            .replace(/-/g, '_')
            ;
    };

    String.prototype.toCamelCase = toCamelCase;
    String.prototype.styleHyphenFormat = styleHyphenFormat;
    String.prototype.tokenize = tokenize;

    class PlutoniumNotification {

        constructor(message, icon, link) {
            this._message = message;
            this._icon = icon;
            this._link = link;
        }

        get message() {
            return this._message;
        }

        set message(value) {
            this._message = value;
        }

        get icon() {
            return this._icon;
        }

        set icon(value) {
            this._icon = value;
        }

        get link() {
            return this._link;
        }

        set link(value) {
            this._link = value;
        }
    }

    class PlutoniumAction {

        constructor(controlId, label, successEvent, failEvent) {
            this._controlId = controlId;
            this._label = label;
            this._successEvent = successEvent;
            this._failEvent = failEvent;
        }

        get controlId() {
            return this._controlId;
        }

        set controlId(value) {
            this._controlId = value;
        }

        get label() {
            return this._label;
        }

        set label(value) {
            this._label = value;
        }

        get successEvent() {
            return this._successEvent;
        }

        set successEvent(value) {
            this._successEvent = value;
        }

        get failEvent() {
            return this._failEvent;
        }

        set failEvent(value) {
            this._failEvent = value;
        }
    }

    class PlutoniumModal {

        constructor(controlId, label, submitAction, dismissAction) {
            this._controlId = controlId;
            this._label = label;
            this._submitAction = submitAction;
            this._dismissAction = dismissAction;
        }

        get controlId() {
            return this._controlId;
        }

        set controlId(value) {
            this._controlId = value;
        }

        get label() {
            return this._label;
        }

        set label(value) {
            this._label = value;
        }

        get submitAction() {
            return this._submitAction;
        }

        set submitAction(value) {
            this._submitAction = value;
        }

        get dismissAction() {
            return this._dismissAction;
        }

        set dismissAction(value) {
            this._dismissAction = value;
        }
    }

    class PlutoniumNavigation {

        constructor(label, link, parameters) {

            this._label = label;
            this._link = link;
            this._parameters = parameters;
        }


        get label() {
            return this._label;
        }

        set label(value) {
            this._label = value;
        }

        get link() {
            return this._link;
        }

        set link(value) {
            this._link = value;
        }

        get parameters() {
            return this._parameters;
        }

        set parameters(value) {
            this._parameters = value;
        }
    }

    class PlutoniumNotificationEvent extends CustomEvent {

        static get name() {
            return Plutonium.NOTIFICATION_EVENT_NAME;
        }

        constructor(notification = new PlutoniumNotification()) {
            super(Plutonium.NOTIFICATION_EVENT_NAME, {
                detail: notification
            });
        }
    }

    class PlutoniumNavigationEvent extends CustomEvent {

        static get name() {
            return Plutonium.NAVIGATION_EVENT_NAME;
        }

        constructor(navigation = new PlutoniumNavigation()) {
            super(Plutonium.NAVIGATION_EVENT_NAME, {
                detail: navigation
            });
        }
    }

    class PlutoniumModalEvent extends CustomEvent {

        static get name() {
            return Plutonium.MODAL_EVENT_NAME;
        }

        constructor(modal = new PlutoniumModal()) {
            super(Plutonium.MODAL_EVENT_NAME, {
                detail: navigation
            });
        }
    }

    Plutonium.DecoratorBuilder = class PlutoniumDecoratorBuilder {


        constructor() {
            this._decorators = [];
            this._eventMap = {};
        }

        notification() {
            this._pushDecorator(this._event);
            this._event = new PlutoniumNotificationEvent();
            return this;
        }

        navigation() {
            this._pushDecorator(this._event);
            this._event = new PlutoniumNavigationEvent();
            return this;
        }

        modal() {
            this._pushDecorator(this._event);
            this._event = new PlutoniumNotificationEvent();
            return this;
        }

        callback(cb) {
            if (isFunction(cb)) {
                this._eventMap[this._event.name] = cb;
            }
            return this;
        }

        label(value) {
            this._currentModel.label = value;
            return this;
        }

        link(value) {
            this._currentModel.label = value;
            return this;
        }

        icon(value) {
            this._currentModel.label = value;
            return this;
        }

        parameters(value) {
            this._currentModel.parameters = value;
            return this;
        }

        build() {
            this._pushDecorator(this._event);
            let decorators = this._decorators;
            return {
                apply(component, eventMap) {
                    if (isDefAndNotNull(eventMap) && isObject(eventMap)) {
                        let eventKey = decorators[index].name;
                        decorators.forEach((value, index) => component.addEventListener(eventKey, event => eventMap[eventKey](event)));
                    } else {
                        let eventKey = decorators[index].name;
                        decorators.forEach((value, index) => component.addEventListener(eventKey, event => eventMap[eventKey](event)));
                    }
                }
            };
        }

        _pushDecorator(e) {
            if (isDefAndNotNull(this._event)) {
                this._decorators.append(this._event);
            }
        }

        get _currentModel() {
            return this._event.detail;
        }
    }

})();