'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//------------------------------------------------------
// ライブラリ定義
//------------------------------------------------------
const Alexa = __importStar(require("ask-sdk"));
/**
 * 応答を組み立てるためのライブラリ
 */
const util = require('util');
//------------------------------------------------------
// 変数・定数定義
//------------------------------------------------------
/**
 * メッセージ格納変数
 */
const MESSAGE = require("./message");
/**
 * 風鈴の種類定義
 * @type {string[]}
 */
const furin = ["daiso", "nanbu_mie", "nousaku", "otaru"];
/**
 * エンティティ解決時の成功コード
 * @type {string}
 */
const ER_SUCCESS_MATCH = "ER_SUCCESS_MATCH";
/**
 * エンティティ解決時の失敗コード
 * @type {string}
 */
const ER_SUCCESS_NO_MATCH = "ER_SUCCESS_NO_MATCH";
//------------------------------------------------------
let skill;
/* LAMBDA SETUP */
exports.handler = function (event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(JSON.stringify(event, null, 2));
        if (!skill) {
            skill = Alexa.SkillBuilders.custom()
                .addRequestHandlers(LaunchRequestHandler, HelpHandler, ExitHandler, SessionEndedRequestHandler)
                .addErrorHandlers(ErrorHandler)
                .create();
        }
        return skill.invoke(event, context);
    });
};
/* INTENT HANDLERS */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
    },
    handle(handlerInput) {
        const num = Math.floor((Math.random() * 4));
        const targetFurin = furin[num];
        const description = MESSAGE.furin[targetFurin];
        return handlerInput.responseBuilder
            .speak(util(MESSAGE.login.speak, targetFurin, description))
            .getResponse();
    },
};
const TypeRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && (request.intent.name === 'TypeIntent');
    },
    handle(handlerInput) {
        //GET REQUEST ATTRIBUTE
        const req = handlerInput.requestEnvelope.request;
        const slot = req.intent.slots.FurinType;
        const response = handlerInput.responseBuilder;
        if (CustomValidator(slot)) {
            const value = slot.resolutions &&
                slot.resolutions.resolutionsPerAuthority[0].values[0].value.name
                || slot.value;
            return response
                .speak(util(MESSAGE.login.speak, value, MESSAGE.furin[value]))
                .getResponse();
        }
        else {
            return response
                .speak(MESSAGE.error.speak)
                .reprompt(MESSAGE.error.reprompt)
                .getResponse();
        }
    }
};
const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.HelpIntent' ||
            request.intent.name === 'AMAZON.HelpHandler');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.help.speak)
            .reprompt(MESSAGE.help.reprompt)
            .getResponse();
    },
};
const ExitHandler = {
    canHandle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        return request.type === `IntentRequest` && (request.intent.name === 'AMAZON.StopIntent' ||
            request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.exit.speak)
            .getResponse();
    },
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        console.log("Inside SessionEndedRequestHandler");
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    },
};
const ErrorHandler = {
    canHandle() {
        console.log("Inside ErrorHandler");
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${JSON.stringify(error)}`);
        console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);
        return handlerInput.responseBuilder
            .speak(MESSAGE.error.speak)
            .reprompt(MESSAGE.error.reprompt)
            .getResponse();
    },
};
/**
 *
 * @param slot
 * @returns {boolean}
 */
const CustomValidator = (slot) => {
    if (slot && slot.resolutions) {
        return slot.resolutions.resolutionsPerAuthority[0].status.code === ER_SUCCESS_MATCH;
    }
    else if (slot && slot.value) {
        return true;
    }
    return false;
};
/**
 *
 * @param slot
 * @returns {*|boolean}
 * @constructor
 */
const Validator = (slot) => {
    return slot && slot.value && slot.value !== "?";
};
//# sourceMappingURL=index.js.map