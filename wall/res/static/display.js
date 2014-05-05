/*
 * Wall
 */

wall.display = {};
(function(ns) {

/* ==== DisplayUi ==== */

ns.DisplayUi = function(bricks) {
    wall.Ui.call(this, bricks);
    this.currentPostElement = null;
    this.loadBricks(bricks, "DisplayBrick");
    this.msgHandlers["posted"] = $.proxy(this._postedMsg, this);
    this.addPostElementType(ns.ImagePostElement);
};

$.extend(ns.DisplayUi.prototype, wall.Ui.prototype, {
    _postedMsg: function(msg) {
        if (this.currentPostElement) {
            this.currentPostElement.element.remove();
            this.currentPostElement.detachedCallback();
            this.currentPostElement = null;
        }

        var post = msg.data;
        var postElementType = this.postElementTypes[post.__type__];
        this.currentPostElement = new postElementType(post, this);
        $("body").append(this.currentPostElement.element);
        this.currentPostElement.attachedCallback();
    }
});

/* ==== PostElement ==== */

ns.PostElement = function(post, ui) {
    wall.PostElement.call(this, post, ui);

    this.content = $('<div class="post-content"></div>').addClass(
            wall.hyphenate(this.postType) + "-content");

    this.element = $('<iframe class="post"></iframe>').addClass(
        wall.hyphenate(this.postType));
    this.element.load(function(event) {
        $("body", this.element[0].contentDocument).append(this.content);
        this.contentAttachedCallback();
    }.bind(this));
    this.element.attr("src", "/display/post");
};

ns.PostElement.prototype = Object.create(wall.PostElement.prototype, {
    contentAttachedCallback: {value: function() {}}
});

/* ==== ImagePostElement ==== */

ns.ImagePostElement = function(post, ui) {
    ns.PostElement.call(this, post, ui);
    this.content.css("background-image", "url(" + this.post.url + ")");
};

ns.ImagePostElement.prototype = Object.create(ns.PostElement.prototype, {
    postType: {value: "ImagePost"}
});

}(wall.display));
