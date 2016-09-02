(function(window) {
    "use strict";

    class ImageMontage {
        constructor(id) {
            this.rootId = id || '#container';
        }
        initBricks = data => {
            const colour = [
                "lightblue",
                "lightcyan",
                "lightcoral",
                "lightpink",
                "lightgrey",
                "lightgreen",
                "lightsalmon",
                "lightskyblue",
                "lightseagreen"
            ];

            // add empty brick as placeholder
            let w = 1, h = 1, html = '', color = '', limitItem = 35;
            for (var i = 0; i < limitItem; ++i) {
                h = 1 + 2 * Math.random() << 0;
                w = 2 + 2 * Math.random() << 0;
                color = colour[colour.length * Math.random() << 0];
                html += `
                    <div class='brick' style='width:${w*150}px; height: ${h*150}px; background-color: ${color}'>
                        <div class='cover'></div>
                    </div>
                `;
            }
            $(this.rootId).html(html);
            this.freewall();

            // fetch random image from imgur
            this.displayImages(data);
        }
        preloadImage = arr => {
            $("#preload").html(``);
            _.map(arr, val => {
                $("#preload").append(`<img src='${val}' />`);
            });
        }
        fixImageSize = data => {
            const { target, parent, child } = data;
            const pWidth = parseInt(parent.width, 10);
            const pHeight = parseInt(parent.height, 10);
            const cWidth = parseInt(child.width, 10);
            const cHeight = parseInt(child.height, 10);

            if(cHeight*pWidth/cWidth < pHeight) {
                $(target).attr("style", "height: "+pHeight+"px");
            }
            else {
                $(target).attr("style", "width: "+pWidth+"px");
            }
        }
        freewall = () => {
            const wall = new Freewall(this.rootId);
            wall.reset({
                selector: '.brick',
                cellW: 160,
                cellH: 160,
                gutterX: 15,
                gutterY: 15,
                onResize: () => {
                    wall.fitZone($(window).width() - 30, $(window).height() - 30);
                },
                onComplete: () => {
                    $.each($(".brick img"), (i, val) => {
                        let $img = $(val);
                        this.fixImageSize({
                            target: $img,
                            parent: {
                                width: $img.parent().css("width"),
                                height: $img.parent().css("height")
                            },
                            child: {
                                width: $img.css("width"),
                                height: $img.css("height")
                            }
                        });
                    });
                }
            });
            wall.fitZone($(window).width() - 30, $(window).height() - 30);
        }
        displayImages = data => {
            let srcs = _.filter(
                _.map(data, val => {
                    if(val.type)return val.link;
                }), link => {
                    return link !== undefined;
                });
            this.preloadImage(srcs);

            let arr = $(".cover");
            let i = setInterval(() => {
                let $target = $(arr.splice(0, 1));
                // width and height of brick
                const pWidth = parseInt($target.parent().css("width"), 10);
                const pHeight = parseInt($target.parent().css("height"), 10);
                let $img =
                    $("<img src='"+srcs.shift()+"' class='cover' />")
                        .load(() => {
                            // natural width and height of image
                            const nWidth = $img.prop("naturalWidth");
                            const nHeight = $img.prop("naturalHeight");

                            $target
                                .parent()
                                .fadeOut(500, () => {
                                    $target.replaceWith($img);
                                    this.fixImageSize({
                                        target: $img,
                                        parent: {
                                            width: pWidth,
                                            height: pHeight
                                        },
                                        child: {
                                            width: nWidth,
                                            height: nHeight
                                        }
                                    });
                                })
                                .fadeIn(500);
                        });
                arr.length === 0 && clearInterval(i);
            }, 3000);
        }
    }
    window.ImageMontage = ImageMontage;
})(window);
