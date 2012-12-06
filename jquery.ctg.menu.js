/*
 * jquery.ctg.menu.js - animates dropdown menus
 *
 * Typical menu structured (element agnostic):
 *
 * Click / Touchstart
 * ul > li > a.ctg-menu-toggle + div.ctg-menu-submenu
 *
 * Hover
 * ul > li.ctg-menu-toggle > a + div.ctg-menu-submenu
 */

(function ($, undefined) {

    $.widget('ctg.menu', {

        options: {
            toggleSelector: '.ctg-menu-toggle',
            subMenuSelector: '.ctg-menu-submenu',
            events: 'mouseenter.menu mouseleave.menu',
            openClass: 'ctg-menu-active',
            openSpeed: 'normal',
            closeSpeed: 'fast',
            openEasing: 'swing',
            closeEasing: 'swing',

            // callbacks
            create: null,
            open: null,
            close: null
        },

        _create: function () {

            var self = this;

            this.element

            // don't prevent default, that can be handled within create callback if needed
                .on(this.options.events, this.options.toggleSelector, function () {
                    var el = $(this);
                    el.data('isOpen') ? self.close(el) : self.open(el);
                });

            if (this.element.hasClass('initopen')) {
                self.open(this.element);
            }

            return;
        },

        open: function (/* jquery obj */toggle) {

            var subMenu = this._getSubMenu(toggle),
                isVisible = subMenu.is(':visible'),

            // when not visible get height otherwise use previously calculated height
            // so .stop() doesn't cause the wrong height to be calculated
                height = isVisible ? subMenu.data('height') : subMenu.height();

            this.hideAll();

            subMenu
                .data('height', height)
                .stop()
                .css({
                    height: isVisible ? null : 0,
                    opacity: isVisible ? null : 0,
                    display: 'block'
                })
                .animate({
                    height: height,
                    opacity: 1
                }, this.options.openSpeed, this.options.openEasing, function () {
                    subMenu.css('height', '');
                });

            subMenu.addClass(this.options.openClass);
            toggle.data('isOpen', true);
            this._trigger('open', null, toggle);

            return;
        },

        close: function (/* jquery obj */toggle) {

            if (!toggle.data('isOpen')) {
                return;
            }

            var subMenu = this._getSubMenu(toggle);

            subMenu
                .stop()
                .animate({
                    height: 0,
                    opacity: 0
                }, this.options.closeSpeed, this.options.closeEasing, function () {
                    subMenu.css({
                        display: 'none',
                        height: '',
                        opacity: ''
                    });
                });

            subMenu.removeClass(this.options.openClass);
            toggle.data('isOpen', false);
            this._trigger('close', null, toggle);

            return;
        },

        hideAll: function () {

            var self = this;

            this.element
                .find(this.options.toggleSelector)
                    .each(function () {
                        self.close($(this));
                    });

            return;
        },

        _getSubMenu: function (/* jquery obj */toggle) {

            var subMenu = toggle.find(this.options.subMenuSelector);

            // if toggle is anchor (common when menu is opened on click or touch event)
            // we need to use find as menu will be a sibling.
            if (!subMenu.length) {
                subMenu = toggle.siblings(this.options.subMenuSelector);
            }

            return subMenu;
        }

    });

})(jQuery);