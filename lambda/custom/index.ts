"use strict";

// ------------------------------------------------------
// ライブラリ定義
// ------------------------------------------------------
import * as Alexa from "ask-sdk";
import {IntentRequest, RequestEnvelope} from "ask-sdk-model";
import * as util from "util";

// ------------------------------------------------------
// 変数・定数定義
// ------------------------------------------------------
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

// ------------------------------------------------------

let skill: Alexa.Skill;

/* LAMBDA SETUP */
exports.handler = async (event: RequestEnvelope, context: any) => {
  console.log(JSON.stringify(event, null, 2));
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        TypeRequestHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  return skill.invoke(event, context);
};

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    console.log("Inside LaunchRequestHandler");
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput: Alexa.HandlerInput) {
    const num = Math.floor((Math.random() * 4));
    const targetFurin: string = furin[num];
    const description: string = MESSAGE.furin[targetFurin];

    return handlerInput.responseBuilder
      .speak(util.format(MESSAGE.login.speak, targetFurin, description))
      .getResponse();
  },
};

const TypeRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && (
      request.intent.name === "TypeIntent"
    );
  },
  handle(handlerInput: Alexa.HandlerInput) {
    // GET REQUEST ATTRIBUTE
    const req: IntentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const slot = req.intent.slots.FurinType;

    const response = handlerInput.responseBuilder;
    if (CustomValidator(slot)) {
      const value = slot.resolutions &&
        slot.resolutions.resolutionsPerAuthority[0].values[0].value.name
        || slot.value;

      return response
        .speak(util.format(MESSAGE.login.speak, value, MESSAGE.furin[value]))
        .getResponse();
    } else {
      return response
        .speak(MESSAGE.error.speak)
        .reprompt(MESSAGE.error.reprompt)
        .getResponse();
    }
  },
};

const HelpHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && (
      request.intent.name === "AMAZON.HelpIntent" ||
      request.intent.name === "AMAZON.HelpHandler"
    );
  },
  handle(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGE.help.speak)
      .reprompt(MESSAGE.help.reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.type === `IntentRequest` && (
      request.intent.name === "AMAZON.StopIntent" ||
      request.intent.name === "AMAZON.CancelIntent"
    );
  },
  handle(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGE.exit.speak)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput: Alexa.HandlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput: Alexa.HandlerInput, error: Error) {
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
const CustomValidator = (slot: any): boolean => {
  if (slot && slot.resolutions) {
    return slot.resolutions.resolutionsPerAuthority[0].status.code === ER_SUCCESS_MATCH;
  } else if (slot && slot.value) {
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
const Validator = (slot: any): boolean => {
  return slot && slot.value && slot.value !== "?";
};
