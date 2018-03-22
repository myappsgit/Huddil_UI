"use strict";
/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "no-string-throw",
    description: "Flags throwing plain strings or concatenations of strings " +
        "because only Errors produce proper stack traces.",
    hasFix: true,
    options: null,
    optionsDescription: "Not configurable.",
    type: "functionality",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING = "Throwing plain strings (not instances of Error) gives no stack traces";
exports.Rule = Rule;
function walk(ctx) {
    var sourceFile = ctx.sourceFile;
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isThrowStatement(node)) {
            var expression = node.expression;
            if (isString(expression)) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING, [
                    Lint.Replacement.appendText(expression.getStart(sourceFile), "new Error("),
                    Lint.Replacement.appendText(expression.getEnd(), ")"),
                ]);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
function isString(node) {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.TemplateExpression:
            return true;
        case ts.SyntaxKind.BinaryExpression: {
            var _a = node, operatorToken = _a.operatorToken, left = _a.left, right = _a.right;
            return operatorToken.kind === ts.SyntaxKind.PlusToken && (isString(left) || isString(right));
        }
        case ts.SyntaxKind.ParenthesizedExpression:
            return isString(node.expression);
        default:
            return false;
    }
}
