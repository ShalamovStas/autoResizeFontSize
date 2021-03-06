console.log("👉 myController works")

myApp.controller("myController", function ($scope, $element) {

    $scope.iterationsCount = 0;
    $scope.name = "my Name";
    $scope.fontSize = 0;
    $scope.handler = "simple"
    $scope.loading = false;
    $scope.performance = false;



    let cell = angular.element(document.querySelector(".cell"))[0];
    let label = angular.element(document.querySelector(".label"))[0];
    $scope.label = label


    let widgetElement = document.querySelector(".widget");
    $scope.widget = angular.element(widgetElement)[0];

    $scope.widgetTitle = angular.element(widgetElement.querySelector(".title"))[0];
    $scope.widgetCounter = angular.element(widgetElement.querySelector(".counter"))[0];


    init();

    setTimeout(() => {
        setCellSize();
    }, 200)


    function init() {
        $scope.containerText = localStorage.getItem("containerText");
        $scope.containerWidth = parseInt(localStorage.getItem("containerWidth"));
        $scope.containerHeight = parseInt(localStorage.getItem("containerHeight"));
        $scope.fontSizeStep = parseFloat(localStorage.getItem("fontSizeStep"));

        $scope.fontSizeStep = 1;

        if (!$scope.fontSizeStep || $scope.fontSizeStep < 1)
            $scope.fontSizeStep = 1;

        if (!$scope.containerText)
            $scope.containerText = "test";

        label.style.fontSize = 2 + "px";
        $scope.$watch('containerText', function (newValue, oldValue) {

            localStorage.setItem("containerText", newValue);
        });

        $scope.$watch('containerWidth', function (newValue, oldValue) {

            localStorage.setItem("containerWidth", newValue);
            setCellSize();
        });

        $scope.$watch('fontSizeStep', function (newValue, oldValue) {

            if (newValue == 0) {
                $scope.fontSizeStep = 1;
                localStorage.setItem("fontSizeStep", 1);
            } else
                localStorage.setItem("fontSizeStep", newValue);

            setCellSize();
        });

        $scope.$watch('containerHeight', function (newValue, oldValue) {

            localStorage.setItem("containerHeight", newValue);
            setCellSize();

        });

        $scope.$watch('iterationsCount', function (newValue, oldValue) {
            console.log("last iterations count: " + newValue)

        });

        $scope.$watch('handler', function (newValue, oldValue) {
            setCellSize();
        });
    }


    function setCellSize() {
        cell.style.width = $scope.containerWidth + "px"
        cell.style.height = $scope.containerHeight + "px"

        $scope.widget.style.width = $scope.containerWidth + "px"
        $scope.widget.style.height = $scope.containerHeight + "px"

        onCalc();

    }

    function onCalc() {
         resizeText(cell, label, { maxHeight: 75, maxWidth: 75 })

        resizeText($scope.widget, $scope.widgetTitle, { maxHeight: 25, maxWidth: 50 })
        resizeText($scope.widget, $scope.widgetCounter, { maxHeight: 75, maxWidth: 50, isOverFlownDelegate: isOverFlownDelegateForWidget, setFontSizeDelegate: setFontSizeDelegate })
    }

    var setFontSizeDelegate = (fontSize, element) => {
        var label = element.querySelector(".value");
        var smallLabel = element.querySelector(".small-label");

        label.style.fontSize = `${fontSize}px`;
        smallLabel.style.fontSize = `${Math.floor(fontSize / 2)}px`;
    }

    var isOverFlownDelegateForWidget = function (cell, label, params) {
        let heightRatio = params?.maxHeight ? params.maxHeight / 100 : 1;
        
        let widthRatio = params?.maxWidth ? params.maxWidth / 100 : 1;

        let heightWidthCheck =
            label.offsetHeight > cell.offsetHeight * heightRatio
            || (label.offsetWidth > cell.offsetWidth * widthRatio || label.offsetHeight > cell.offsetHeight * heightRatio);

        let overflowScrollCheck = (label.offsetHeight < label.scrollHeight || label.offsetWidth < label.scrollWidth);

        return heightWidthCheck || overflowScrollCheck;
    }

    $scope.onCalc = onCalc;






    //-----------------------------------

    function resizeText(cell, label, params) {
        var startTime = performance.now()

        if (!params)
            params = {
                maxHeight: 100,
                maxWidth: 100
            };

        $scope.iterationsCount = 0;


        $scope.iterationsCount = binarySearch(cell, label, params);


        // switch ($scope.handler) {
        //     case "simple":
        //         $scope.iterationsCount = simpleResize(cell, label, params);
        //         break;
        //     case "type_1":
        //         $scope.iterationsCount = search_type_1(cell, label, params);
        //         break;
        //     case "type_2":
        //         $scope.iterationsCount = search_type_2(cell, label, params);
        //         break;

        // }

        var endTime = performance.now();

        let resPerformance = endTime - startTime;

        $scope.performance = resPerformance;
        console.log(`Call to doSomething took ${resPerformance} milliseconds`);
    }

    function search_type_1(cell, label, params) {
        let iterationsCount = 0;

        let minFontSize = 1;
        let maxFontSize = cell.offsetHeight;

        let currentFontSize = maxFontSize;



        //arraySizes
        let fontSizesList = [];

        for (let index = 0; index <= maxFontSize; index++) {
            fontSizesList.push(index + $scope.fontSizeStep);
        }

        label.style.overflow = "auto";

        let currentIndex = fontSizesList.length - 1;
        let minFontSizeIsFound = false;

        while (true) {
            iterationsCount++;
            label.style.fontSize = `${currentFontSize}px`;

            let isOverflown = isOverflownCheck(cell, label, params) || isOverflowByScroll(label)

            if (isOverflown) {
                if (minFontSizeIsFound) {
                    currentFontSize = fontSizesList[currentIndex - 1];
                    label.style.fontSize = `${currentFontSize}px`;
                    return iterationsCount;
                }
                currentIndex = Math.floor(currentIndex / 2);
            }
            else {
                minFontSizeIsFound = true;
                currentIndex++;
            }
            currentFontSize = fontSizesList[currentIndex];
        }
    }



    function binarySearch(cell, label, params) {
        let iterationsCount = 0;

        let maxFontSize = cell.offsetHeight;

        let currentFontSize = maxFontSize;

        let fontSizesList = [];

        for (let index = 0; index <= maxFontSize; index++) {
            fontSizesList.push(index + $scope.fontSizeStep);
        }

        label.style.overflow = "auto";
        label.style.width = 'fit-content'


        let currentIndex = fontSizesList.length - 1;

        let maxIndex = fontSizesList.length - 1;
        let minIndex = 0;


        let binarySearchIterationsCount = Math.ceil(Math.log2(fontSizesList.length)) + 1;
        console.log(`👉 arraySize:  ${fontSizesList.length} \n iterations: ${binarySearchIterationsCount}`)


        while (true) {
            console.log(`current ARR LENTH ${maxIndex - minIndex}`);

            if (params.setFontSizeDelegate)
                params.setFontSizeDelegate(currentFontSize, label);
            else
                label.style.fontSize = `${currentFontSize}px`;

            let isOverflown
            if (params.isOverFlownDelegate)
                isOverflown = params.isOverFlownDelegate(cell, label, params);
            else
                isOverflown = isOverflownCheck(cell, label, params) || isOverflowByScroll(label, params)

            if (maxIndex - minIndex === 1) {
                label.style.removeProperty("overflow");
                label.style.removeProperty("width");
                return iterationsCount;
            }

            if (isOverflown) {
                maxIndex = currentIndex;
            }
            else {
                minIndex = currentIndex;
            }

            currentIndex = Math.floor(((maxIndex - minIndex) / 2) + minIndex);
            currentFontSize = fontSizesList[currentIndex];
            iterationsCount++;
        }
    }

    function simpleResize(cell, label, params) {
        let iterationsCount = 0;
        let fontSizeStep = $scope.fontSizeStep;
        let currentFontSize = fontSizeStep;

        label.style.overflow = "auto";

        while (true) {
            iterationsCount++;
            label.style.fontSize = `${currentFontSize}px`;

            let isOverflown = isOverflownCheck(cell, label, params) || isOverflowByScroll(label)

            if (isOverflown) {
                label.style.fontSize = `${(currentFontSize - fontSizeStep)}px`;
                label.style.removeProperty("overflow");
                return iterationsCount;
            }
            currentFontSize = currentFontSize + fontSizeStep;
        }
    }

    function isOverflownCheck(cell, label, params) {
        let heightRatio = params?.maxHeight ? params.maxHeight / 100 : 1;
        let widthRatio = params?.maxWidth ? params.maxWidth / 100 : 1;

        return label.offsetHeight > cell.offsetHeight * heightRatio
            || (label.offsetWidth > cell.offsetWidth * widthRatio || label.offsetHeight > cell.offsetHeight * heightRatio);
    }

    function isOverflowByScroll(label) {
        return window.getComputedStyle(label).overflow === 'auto'
            &&
            (label.offsetHeight < label.scrollHeight || label.offsetWidth < label.scrollWidth);
    }

});