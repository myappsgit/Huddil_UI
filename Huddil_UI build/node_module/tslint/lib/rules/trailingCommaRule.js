"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
var defaultOptions = fillOptions("ignore");
function fillOptions(value) {
    return {
        arrays: value,
        exports: value,
        functions: value,
        imports: value,
        objects: value,
        typeLiterals: value,
    };
}
function normalizeOptions(options) {
    return { multiline: normalize(options.multiline), singleline: normalize(options.singleline) };
    function normalize(value) {
        return typeof value === "string" ? fillOptions(value) : tslib_1.__assign({}, defaultOptions, value);
    }
}
/* tslint:disable:object-literal-sort-keys */
var metadataOptionShape = {
    anyOf: [
        {
            type: "string",
            enum: ["always", "never"],
        },
        {
            type: "object",
            properties: fillOptions({
                type: "string",
                enum: ["always", "never", "ignore"],
            }),
        },
    ],
};
/* tslint:enable:object-literal-sort-keys */
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = normalizeOptions(this.ruleArguments[0]);
        return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.ruleName, options));
    };
    Rule.prototype.isEnabled = function () {
        return _super.prototype.isEnabled.call(this) && this.ruleArguments.length !== 0;
    };
    return Rule;
}(Lint.Rules.AbstractRule));
/* tslint:disable:object-literal-sort-keys */
Rule.metadata = {
    ruleName: "trailing-comma",
    description: (_a = ["\n            Requires or disallows trailing commas in array and object literals, destructuring assignments, function typings,\n            named imports and exports and function parameters."], _a.raw = ["\n            Requires or disallows trailing commas in array and object literals, destructuring assignments, function typings,\n            named imports and exports and function parameters."], Lint.Utils.dedent(_a)),
    hasFix: true,
    optionsDescription: (_b = ["\n            One argument which is an object with the keys `multiline` and `singleline`.\n            Both can be set to a string (`\"always\"` or `\"never\"`) or an object.\n\n            The object can contain any of the following keys: `\"arrays\"`, `\"objects\"`, `\"functions\"`,\n            `\"imports\"`, `\"exports\"`, and `\"typeLiterals\"`; each key can have one of the following\n            values: `\"always\"`, `\"never\"`, and `\"ignore\"`. Any missing keys will default to `\"ignore\"`.\n\n            * `\"multiline\"` checks multi-line object literals.\n            * `\"singleline\"` checks single-line object literals.\n\n            An array is considered \"multiline\" if its closing bracket is on a line\n            after the last array element. The same general logic is followed for\n            object literals, function typings, named import statements\n            and function parameters."], _b.raw = ["\n            One argument which is an object with the keys \\`multiline\\` and \\`singleline\\`.\n            Both can be set to a string (\\`\"always\"\\` or \\`\"never\"\\`) or an object.\n\n            The object can contain any of the following keys: \\`\"arrays\"\\`, \\`\"objects\"\\`, \\`\"functions\"\\`,\n            \\`\"imports\"\\`, \\`\"exports\"\\`, and \\`\"typeLiterals\"\\`; each key can have one of the following\n            values: \\`\"always\"\\`, \\`\"never\"\\`, and \\`\"ignore\"\\`. Any missing keys will default to \\`\"ignore\"\\`.\n\n            * \\`\"multiline\"\\` checks multi-line object literals.\n            * \\`\"singleline\"\\` checks single-line object literals.\n\n            An array is considered \"multiline\" if its closing bracket is on a line\n            after the last array element. The same general logic is followed for\n            object literals, function typings, named import statements\n            and function parameters."], Lint.Utils.dedent(_b)),
    options: {
        type: "object",
        properties: {
            multiline: metadataOptionShape,
            singleline: metadataOptionShape,
        },
        additionalProperties: false,
    },
    optionExamples: [
        [true, { multiline: "always", singleline: "never" }],
        [
            true,
            {
                multiline: {
                    objects: "always",
                    arrays: "always",
                    functions: "never",
                    typeLiterals: "ignore",
                },
            },
        ],
    ],
    type: "maintainability",
    typescriptOnly: false,
};
/* tslint:enable:object-literal-sort-keys */
Rule.FAILURE_STRING_NEVER = "Unnecessary trailing comma";
Rule.FAILURE_STRING_ALWAYS = "Missing trailing comma";
exports.Rule = Rule;
var TrailingCommaWalker = (function (_super) {
    tslib_1.__extends(TrailingCommaWalker, _super);
    function TrailingCommaWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrailingCommaWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ArrayLiteralExpression:
                case ts.SyntaxKind.ArrayBindingPattern:
                    _this.checkList(node.elements, node.end, "arrays");
                    break;
                case ts.SyntaxKind.ObjectBindingPattern:
                    _this.checkList(node.elements, node.end, "objects");
                    break;
                case ts.SyntaxKind.NamedImports:
                    _this.checkList(node.elements, node.end, "imports");
                    break;
                case ts.SyntaxKind.NamedExports:
                    _this.checkList(node.elements, node.end, "exports");
                    break;
                case ts.SyntaxKind.ObjectLiteralExpression:
                    _this.checkList(node.properties, node.end, "objects");
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    _this.checkList(node.members, node.end, "objects");
                    break;
                case ts.SyntaxKind.NewExpression:
                    if (node.arguments === undefined) {
                        break;
                    }
                // falls through
                case ts.SyntaxKind.CallExpression:
                    _this.checkList(node.arguments, node.end, "functions");
                    break;
                case ts.SyntaxKind.ArrowFunction:
                case ts.SyntaxKind.Constructor:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.MethodSignature:
                case ts.SyntaxKind.ConstructSignature:
                case ts.SyntaxKind.ConstructorType:
                case ts.SyntaxKind.FunctionType:
                case ts.SyntaxKind.CallSignature:
                    _this.checkListWithEndToken(node, node.parameters, ts.SyntaxKind.CloseParenToken, "functions");
                    break;
                case ts.SyntaxKind.TypeLiteral:
                    _this.checkTypeLiteral(node);
                    break;
                default:
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    TrailingCommaWalker.prototype.checkTypeLiteral = function (node) {
        var members = node.members;
        if (members.length === 0) {
            return;
        }
        var sourceText = this.sourceFile.text;
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            // PropertySignature in TypeLiteral can end with semicolon or comma. If one ends with a semicolon don't check for trailing comma
            if (sourceText[member.end - 1] === ";") {
                return;
            }
        }
        // The trailing comma is part of the last member and therefore not present as hasTrailingComma on the NodeArray
        var hasTrailingComma = sourceText[members.end - 1] === ",";
        return this.checkComma(hasTrailingComma, members, node.end, "typeLiterals");
    };
    TrailingCommaWalker.prototype.checkListWithEndToken = function (node, list, closeTokenKind, optionKey) {
        if (list.length === 0) {
            return;
        }
        var token = tsutils_1.getChildOfKind(node, closeTokenKind, this.sourceFile);
        if (token !== undefined) {
            return this.checkComma(list.hasTrailingComma === true, list, token.end, optionKey);
        }
    };
    TrailingCommaWalker.prototype.checkList = function (list, closeElementPos, optionKey) {
        if (list.length === 0) {
            return;
        }
        return this.checkComma(list.hasTrailingComma === true, list, closeElementPos, optionKey);
    };
    /* Expects `list.length !== 0` */
    TrailingCommaWalker.prototype.checkComma = function (hasTrailingComma, list, closeTokenPos, optionKey) {
        var options = tsutils_1.isSameLine(this.sourceFile, list[list.length - 1].end, closeTokenPos)
            ? this.options.singleline
            : this.options.multiline;
        var option = options[optionKey];
        if (option === "always" && !hasTrailingComma) {
            this.addFailureAt(list.end, 0, Rule.FAILURE_STRING_ALWAYS, Lint.Replacement.appendText(list.end, ","));
        }
        else if (option === "never" && hasTrailingComma) {
            this.addFailureAt(list.end - 1, 1, Rule.FAILURE_STRING_NEVER, Lint.Replacement.deleteText(list.end - 1, 1));
        }
    };
    return TrailingCommaWalker;
}(Lint.AbstractWalker));
var _a, _b;
