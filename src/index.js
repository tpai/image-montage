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
                    <div class='brick' style='width:${w*100}px; height: ${h*100}px; background-color: ${color}'>
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
                const nWidth = cWidth*pHeight/cHeight
                const centerX = (nWidth-pWidth)/2;
                $(target).attr("style", "height: "+pHeight+"px; margin-left: -"+centerX+"px");
            }
            else {
                const nHeight = cHeight*pWidth/cWidth
                const centerY = (nHeight-pHeight)/2;
                $(target).attr("style", "width: "+pWidth+"px; margin-top: -"+centerY+"px");
            }
        }
        freewall = () => {
            const wall = new Freewall(this.rootId);
            wall.reset({
                selector: '.brick',
                cellW: 150,
                cellH: 150,
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
            this.preloadImage(data);

            let arr = $(".cover");
            let i = setInterval(() => {
                let $target = $(arr.splice(0, 1));
                // width and height of brick
                const pWidth = parseInt($target.parent().css("width"), 10);
                const pHeight = parseInt($target.parent().css("height"), 10);
                let $img =
                    $("<img src='"+data.shift()+"' class='cover' />")
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
