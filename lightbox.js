function getImageTemplate(image) {
    const template = `
    <div class="lightbox">
        <div class="lightbox-content">
            <i class="fa fa-angle-left lightbox-previous"></i>
            <img src="${image}" alt="" class="lightbox-image">
            <i class="fa fa-angle-right lightbox-next"></i>
        </div>
    </div>`;

    return template;
}

const images = document.querySelectorAll('.content img');

images.forEach(item => item.addEventListener('click', handleZoomImage));

function handleZoomImage(event) {
    const image = event.target.getAttribute('src');
    document.body.insertAdjacentHTML('beforeend', getImageTemplate(image));
}

let index = 0;

function renderLightImageAsIndex(defaultImages, currentLightImage, Func) {
    const lightImageSrc = currentLightImage.getAttribute('src');
    currentLightImage.removeAttribute('src');

    // return index of default images by current light image
    index = Func(defaultImages, lightImageSrc);
    
    if (index > defaultImages.length - 1) {
        index = 0;
    } else if (index < 0) {
        // index <= 0
        index = defaultImages.length - 1;
    }

    const lightImageSrcFromIndex = defaultImages[index].getAttribute('src');

    currentLightImage.setAttribute('src', lightImageSrcFromIndex);
}

// tách ra 1 file khác để handle
const CLOSE_ACTION = 'close';
const NEXT_ACTION = 'next';
const PREVIOUS_ACTION = 'previous';

const lightImgaeStrategies = {
    [CLOSE_ACTION]: function (options) {
        const { eventTarget } = options;

        eventTarget.parentNode.removeChild(eventTarget);
    },
    [NEXT_ACTION]: function(options) {
        const { contentImages, lightImage } = options;
        
        renderLightImageAsIndex(contentImages, lightImage, function(imgs, lightImageSrc) {
            return imgs.findIndex(item => item.getAttribute('src') === lightImageSrc) + 1;
        });
    },
    [PREVIOUS_ACTION]: function(options) {
        const { contentImages, lightImage } = options;
        renderLightImageAsIndex(contentImages, lightImage, function(imgs, lightImageSrc) {
            return imgs.findIndex(item => item.getAttribute('src') === lightImageSrc) - 1;
        });
    }
};

function getLightboxActionsConverter() {
    // const classNameToStrategy =
    return new Map([
        ['.lightbox', CLOSE_ACTION],
        ['.lightbox-next', NEXT_ACTION],
        ['.lightbox-previous', PREVIOUS_ACTION]
    ]);
}

// cách 1
// function createOptions(eventTarget, contentImages, lightImage) {
//     return {
//         eventTarget,
//         contentImages,
//         lightImage
//     };
// }

// cách 2
function createOptions(options) {
    return options;
}

/**
 * @desc This function convert class name into constant key of lightboxStrategy object
 * @param {String} strategy 
 * @param {Object} args 
 * @returns 
 */
function handleStrategy(strategy, args) {
    if (!strategy) {
        return;
    }
    
    const action = getLightboxActionsConverter().get(strategy);

    return lightImgaeStrategies[action](args);
}

document.body.addEventListener('click', function(e) {
    const contentImages = [...images];
    const lightImage = document.querySelector('.lightbox-image');

    // const test = Array.from(e.target.classList).find(cls => actions.hasOwnProperty(`.${cls}`));

    // check e.target has action in srtategy or not
    // vì ko để key là class name nên sẽ ko check cách này
    // vì muốn map nó sang những tên riêng để sau này có thể tái sử dụng lại nó

    const actionName = Array.from(e.target.classList).find(cls => getLightboxActionsConverter().has(`.${cls}`));

    if (!actionName) {
        return;
    }
   
    handleStrategy(`.${actionName}`, createOptions({ 
        eventTarget: e.target,
        contentImages, 
        lightImage 
    }));


    // cách thủ công dùng e.target.matches(className)
    // if (e.target.matches('.lightbox')) {

    //     handleStrategy('close', [e.target]);

    // } else if (e.target.matches('.lightbox-next')
    //     || e.target.matches('.lightbox-previous')) {
            
    //     const strategy = e.target.matches('.lightbox-next') ? 'next' : 'previous';

    //     handleStrategy(strategy, [contentImages, lightImage]);
    // }
});












