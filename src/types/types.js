export var CategoryEnum;
(function (CategoryEnum) {
    CategoryEnum["Chinese"] = "Chinese";
    CategoryEnum["Indian"] = "Indian";
    CategoryEnum["Western"] = "Western";
    CategoryEnum["Korean/Jap"] = "Korean/Jap";
    CategoryEnum["Halal"] = "Halal";
})(CategoryEnum || (CategoryEnum = {}));

export var ModeEnum;
(function (ModeEnum) {
    ModeEnum["physical"] = "Physical";
    ModeEnum["online"] = "Online Order";
    ModeEnum["both"] = "Physical, Online Order";
})(ModeEnum || (ModeEnum = {}));

export var DeliveryOptionsEnum;
(function (DeliveryOptionsEnum) {
    DeliveryOptionsEnum["selfpickup"] = "Self pick-up";
    DeliveryOptionsEnum["sameday"] = "Same day delivery";
    DeliveryOptionsEnum["oneday"] = "One-day delivery";
    DeliveryOptionsEnum["delivery"] = "Standard delivery";
})(DeliveryOptionsEnum || (DeliveryOptionsEnum = {}));
