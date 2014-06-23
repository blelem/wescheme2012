// if not defined, declare the compiler object as part of plt
if(typeof(plt) === "undefined")          plt = {};
if(typeof(plt.compiler) === "undefined") plt.compiler = {};


/**************************************************************************
 *
 *    BYTECODE STRUCTS -
 *    (see https://github.com/bootstrapworld/wescheme-compiler2012/blob/master/js-runtime/src/bytecode-structs.ss)
 *
 **************************************************************************/

// all Programs, by default, print out their values and have no location
// anything that behaves differently must provide their own toString() function
var Bytecode = function() {
  // -> String
  this.serialize = function(){ return this.val.toString(); };
};


// Global bucket
function globalBucket(name) {
  Bytecode.call(this);
  this.$    = 'global-bucket';
  this.name = name;  // symbol
  this.serialize = function(){
    return "";
  };
};
globalBucket.prototype = heir(Bytecode.prototype);

// Module variable
function moduleVariable(modidx, sym, pos, phase) {
  Bytecode.call(this);
  this.$    = 'module-variable';
  this.modidx = modidx; // module-path-index
  this.sym    = sym;    // symbol
  this.pos    = pos;    // exact integer
  this.phase  = phase;  // 1/0 - direct access to exported id
  this.serialize = function(){
    return "";
  };
};
moduleVariable.prototype = heir(Bytecode.prototype);

// Wrap syntax object
function wrap() {
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
wrap.prototype = heir(Bytecode.prototype);

// Wrapped syntax object
function wrapped(datum, wraps, certs) {
  Bytecode.call(this);
  this.datum  = datum;  // any
  this.wraps  = wraps;  // list of wrap
  this.certs = certs;   // list or false
  this.serialize = function(){
    return "";
  };
};
wrapped.prototype = heir(Bytecode.prototype);

// Stx
function stx(encoded) {
  this.encoded  = encoded;  // wrapped
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
stx.prototype = heir(Bytecode.prototype);

// prefix
function prefix(numLifts, toplevels, stxs) {
  Bytecode.call(this);
  this.$    = 'prefix';
  this.numLifts   = numLifts;  // exact, non-negative integer
  this.toplevels  = toplevels; // list of (false, symbol, globalBucket or moduleVariable)
  this.stxs       = stxs;      // list of stxs
  this.serialize = function(){
    return "";
  };
};
prefix.prototype = heir(Bytecode.prototype);

// form
function form() {
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
form.prototype = heir(Bytecode.prototype);

// expr
function expr(form) {
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
expr.prototype = heir(Bytecode.prototype);

// Indirect
function indirect(v) {
  Bytecode.call(this);
  this.$  = 'indirect';
  this.v  = v; // ??
  this.serialize = function(){
    return "";
  };
};
indirect.prototype = heir(Bytecode.prototype);

// compilationTop
function compilationTop(maxLetDepth, prefix, code) {
  Bytecode.call(this);
  this.$          = 'compilation-top';
  this.maxLetDepth= maxLetDepth;  // exact non-negative integer
  this.prefix     = prefix;       // prefix
  this.code       = code;         // form, indirect, or any
  this.serialize  = function(){
    return "";
  };
};
compilationTop.prototype = heir(Bytecode.prototype);

// provided
function provided(name, src, srcName, nomSrc, srcPhase, protected, insp) {
  Bytecode.call(this);
  this.name     = name;      // symbol
  this.src      = src;       // false or modulePathIndex
  this.srcName  = srcName;   // symbol
  this.nomSrc   = nomSrc;    // false or modulePathIndex
  this.srcPhase = srcPhase;  // 0/1
  this.protected= protected; // boolean
  this.insp     = insp;      // boolean or void
  this.serialize = function(){
    return "";
  };
};
provided.prototype = heir(Bytecode.prototype);

// toplevel
function toplevel(depth, pos, constant, ready, loc) {
  Bytecode.call(this);
  this.$        = 'toplevel';
  this.depth    = depth;    // exact, non-negative integer
  this.pos      = pos;      // exact, non-negative integer
  this.constant = constant; // boolean
  this.ready    = ready;    // boolean
  this.loc      = loc;      // false or Location
  this.serialize = function(){
    return "";
  };
};
toplevel.prototype = heir(Bytecode.prototype);

// seq
function seq(forms) {
  Bytecode.call(this);
  this.$        = 'seq';
  this.forms    = forms;  // list of form, indirect, any
  this.serialize = function(){
    return "";
  };
};
seq.prototype = heir(Bytecode.prototype);

// defValues
function defValues(ids, rhs) {
  this.ids  = ids;  // list of toplevel or symbol
  this.rhs  = rhs;  // expr, indirect, seq, any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
defValues.prototype = heir(Bytecode.prototype);

// defSyntaxes
function defSyntaxes(ids, rhs, prefix, maxLetDepth) {
  Bytecode.call(this);
  this.$          = 'def-values';
  this.ids        = ids;      // list of toplevel or symbol
  this.rhs        = rhs;      // expr, indirect, seq, any
  this.prefix     = prefix;   // prefix
  this.maxLetDepth= maxLetDepth; // exact, non-negative integer
  this.serialize = function(){
    return "";
  };
};
defSyntaxes.prototype = heir(Bytecode.prototype);

// defForSyntax
function defForSyntax(ids, rhs, prefix, maxLetDepth) {
  Bytecode.call(this);
  this.ids        = ids;      // list of toplevel or symbol
  this.rhs        = rhs;      // expr, indirect, seq, any
  this.prefix     = prefix;   // prefix
  this.maxLetDepth= maxLetDepth; // exact, non-negative integer
  this.serialize = function(){
    return "";
  };
};
defForSyntax.prototype = heir(Bytecode.prototype);

// mod
function mod(name, selfModidx, prefix, provides, requires, body,
             syntaxBody, unexported, maxLetDepth, dummy, langInfo,
             internalContext) {
  Bytecode.call(this);
  this.$          = 'mod';
  this.name       = name;         // exact, non-negative integer
  this.selfModidx = selfModidx;   // exact, non-negative integer
  this.prefix     = prefix;       // boolean
  this.provides   = provides;     // boolean
  this.requires   = requires;     // false or Location
  this.body       = body;         // exact, non-negative integer
  this.syntaxBody = syntaxBody;   // exact, non-negative integer
  this.unexported = unexported;   // boolean
  this.maxLetDepth= maxLetDepth;  // exact, non-negative integer
  this.dummy      = dummy;        // false or Location
  this.langInfo   = langInfo;     // false or (vector modulePath symbol any)
  this.internalContext = internalContext;
  this.serialize = function(){
    return "";
  };
};
mod.prototype = heir(Bytecode.prototype);

// lam
function lam(name, operatorAndRandLocs, flags, numParams, paramTypes,
             rest, closureMap, closureTypes, maxLetDepth, body) {
  Bytecode.call(this);
  this.$          = 'lam';
  this.name       = name;         // symbol, vector, empty
  this.flags      = flags;        // (list of ('preserves-marks 'is-method 'single-result))
  this.numParams  = numParams;    // exact, non-negative integer
  this.paramTypes = paramTypes;   // list of ('val 'ref 'flonum)
  this.rest       = rest;         // boolean
  this.body       = body;         // expr, seq, indirect
  this.closureMap = closureMap;   // vector of exact, non-negative integers
  this.maxLetDepth= maxLetDepth;  // exact, non-negative integer
  this.closureTypes=closureTypes; // list of ('val/ref or 'flonum)
  this.operatorAndRandLocs = operatorAndRandLocs;
  // operator+rand-locs includes a list of vectors corresponding to the location
  // of the operator, operands, etc if we can pick them out.  If we can't get
  // this information, it's false
  this.serialize = function(){
    return "";
  };
};
lam.prototype = heir(Bytecode.prototype);


// closure: a static closure (nothing to close over)
function closure(code, genId) {
  Bytecode.call(this);
  this.$        = 'closure';
  this.code     = code;  // lam
  this.genId    = genId; // symbol
  this.serialize = function(){
    return "";
  };
};
closure.prototype = heir(Bytecode.prototype);

// caseLam: each clause is a lam (added indirect)
function caseLam(name, clauses) {
  Bytecode.call(this);
  this.$        = 'case-lam';
  this.name     = name;  // symbol, vector, empty
  this.clauses  = clauses; // list of (lambda or indirect)
  this.serialize = function(){
    return "";
  };
};
caseLam.prototype = heir(Bytecode.prototype);

// letOne
function letOne(rhs, body, flonum) {
  Bytecode.call(this);
  this.$       = 'let-one';
  this.rhs     = rhs;   // expr, seq, indirect, any
  this.body    = body;  // expr, seq, indirect, any
  this.flonum  = flonum;// boolean
  this.serialize = function(){
    return "";
  };
};
letOne.prototype = heir(Bytecode.prototype);

// letVoid
function letVoid(count, boxes, body) {
  Bytecode.call(this);
  this.$       = 'let-voide';
  this.count   = count;   // exact, non-negative integer
  this.boxes   = boxes;   // boolean
  this.body    = body;    // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
letVoid.prototype = heir(Bytecode.prototype);

// letRec: put `letrec'-bound closures into existing stack slots
function letRec(procs, body) {
  Bytecode.call(this);
  this.$       = 'let-rec';
  this.procs   = procs;   // list of lambdas
  this.body    = body;    // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
letRec.prototype = heir(Bytecode.prototype);

// installValue
function installValue(count, pos, boxes, rhs, body) {
  Bytecode.call(this);
  this.$       = 'install-value';
  this.count   = count;   // exact, non-negative integer
  this.pos     = pos;     // exact, non-negative integer
  this.boxes   = boxes;   // boolean
  this.rhs     = rhs;     // expr, seq, indirect, any
  this.body    = body;    // expr, seq, indirect, any -- set existing stack slot(s)
  this.serialize = function(){
    return "";
  };
};
installValue.prototype = heir(Bytecode.prototype);

// boxEnv: box existing stack element
function boxEnv(pos, body) {
  Bytecode.call(this);
  this.$       = 'boxenv';
  this.pos     = pos;     // exact, non-negative integer
  this.body    = body;    // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
boxEnv.prototype = heir(Bytecode.prototype);

// localRef: access local via stack
function localRef(unbox, pos, clear, otherClears, flonum) {
  Bytecode.call(this);
  this.$       = 'localref';
  this.unbox   = unbox;   // boolean
  this.pos     = pos;     // exact, non-negative integer
  this.clear   = clear;   // boolean
  this.flonum  = flonum;  // boolean
  this.otherClears= otherClears; // boolean
  this.serialize = function(){
    return "";
  };
};
localRef.prototype = heir(Bytecode.prototype);

// topSyntax : access syntax object via prefix array (which is on stack)
function topSyntax(depth, pos, midpt) {
  Bytecode.call(this);
  this.depth   = depth;   // exact, non-negative integer
  this.pos     = pos;     // exact, non-negative integer
  this.midpt   = midpt;   // exact, non-negative integer
  this.serialize = function(){
    return "";
  };
};
topSyntax.prototype = heir(Bytecode.prototype);

// application: function call
function application(rator, rands) {
  Bytecode.call(this);
  this.$       = 'application';
  this.rator   = rator;   // expr, seq, indirect, any
  this.rands   = rands;   // list of (expr, seq, indirect, any)
  this.serialize = function(){
    return "";
  };
};
application.prototype = heir(Bytecode.prototype);

// branch
function branch(testExpr, thenExpr, elseExpr) {
  Bytecode.call(this);
  this.$        = 'branch';
  this.testExpr = testExpr;   // expr, seq, indirect, any
  this.thenExpr = thenExpr;   // expr, seq, indirect, any
  this.elseExpr = elseExpr;   // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
branch.prototype = heir(Bytecode.prototype);

// withContMark: 'with-cont-mark'
function withContMark(key, val, body) {
  Bytecode.call(this);
  this.$    = 'with-cont-mark';
  this.key  = key;   // expr, seq, indirect, any
  this.val  = val;   // expr, seq, indirect, any
  this.body = body;  // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
withContMark.prototype = heir(Bytecode.prototype);

// beg0: begin0
function beg0(seq) {
  Bytecode.call(this);
  this.$    = 'beg0';
  this.seq  = seq;   // list  of (expr, seq, indirect, any)
  this.serialize = function(){
    return "";
  };
};
beg0.prototype = heir(Bytecode.prototype);

// splice: top-level 'begin'
function splice(forms) {
  Bytecode.call(this);
  this.$      = 'splice';
  this.forms  = forms;   // list  of (expr, seq, indirect, any)
  this.serialize = function(){
    return "";
  };
};
splice.prototype = heir(Bytecode.prototype);

// varRef: `#%variable-reference'
function varRef(topLevel) {
  Bytecode.call(this);
  this.$        = 'varref';
  this.topLevel  = topLevel;   // topLevel
  this.serialize = function(){
    return "";
  };
};
varRef.prototype = heir(Bytecode.prototype);

// assign: top-level or module-level set!
function assign(id, rhs, undefOk) {
  Bytecode.call(this);
  this.$       = 'assign';
  this.id      = id;      // topLevel
  this.rhs     = rhs;     // expr, seq, indirect, any
  this.undefOk = undefOk; // boolean
  this.serialize = function(){
    return "";
  };
};
assign.prototype = heir(Bytecode.prototype);

// applyValues: `(call-with-values (lambda () ,args-expr) ,proc)
function applyValues(proc, args) {
  Bytecode.call(this);
  this.$       = 'apply-values';
  this.proc    = proc;    // expr, seq, indirect, any
  this.args    = args;    // expr, seq, indirect, any
  this.serialize = function(){
    return "";
  };
};
applyValues.prototype = heir(Bytecode.prototype);

// primVal: direct preference to a kernel primitive
function primVal(id) {
  Bytecode.call(this);
  this.$       = 'primval';
  this.id      = id;    // exact, non-negative integer
  this.serialize = function(){
    return "";
  };
};
primVal.prototype = heir(Bytecode.prototype);

// req
function req(reqs, dummy) {
  Bytecode.call(this);
  this.$        = 'req';
  this.reqs    = reqs;    // syntax
  this.dummy   = dummy;   // toplevel
  this.serialize = function(){
    return "";
  };
};
req.prototype = heir(Bytecode.prototype);

// lexicalRename
function lexicalRename(bool1, bool2, alist) {
  this.bool1   = bool1;    // boolean
  this.bool2   = bool2;    // boolean
  this.alist   = alist;    // should be list of (cons symbol, symbol)
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
lexicalRename.prototype = heir(Bytecode.prototype);

// phaseShift
function phaseShift(amt, src, dest) {
  this.amt     = amt;    // syntax
  this.src     = src;    // false or modulePathIndex
  this.dest    = dest;   // false or modulePathIndex
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
phaseShift.prototype = heir(Bytecode.prototype);

// wrapMark
function wrapMark(val) {
  this.val     = val;    // exact integer
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
wrapMark.prototype = heir(Bytecode.prototype);

// prune
function prune(sym) {
  this.sym     = sym;    // any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
prune.prototype = heir(Bytecode.prototype);

// allFromModule
function allFromModule(path, phase, srcPhase, exceptions, prefix) {
  this.path     = path;     // modulePathIndex
  this.phase    = phase;    // false or exact integer
  this.srcPhase = srcPhase; // any
  this.prefix   = prefix;    // false or symbol
  this.exceptions=exceptions;  // list of symbols
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
allFromModule.prototype = heir(Bytecode.prototype);

// nominalPath
function nominalPath() {
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
nominalPath.prototype = heir(Bytecode.prototype);

// simpleNominalPath
function simpleNominalPath(value) {
  this.value = value; // modulePathIndex
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
simpleNominalPath.prototype = heir(Bytecode.prototype);

// moduleBinding
function moduleBinding() {
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
moduleBinding.prototype = heir(Bytecode.prototype);

// phasedModuleBinding
function phasedModuleBinding(path, phase, exportName, nominalPath, nominalExportName) {
  this.path       = path;       // modulePathIndex
  this.phase      = phase;      // exact integer
  this.exportName = nominalPath;// nominalPath
  this.nominalExportName  = nominalExportName; // any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
phasedModuleBinding.prototype = heir(Bytecode.prototype);

// exportedNominalModuleBinding
function exportedNominalModuleBinding(path, exportName, nominalPath, nominalExportName) {
  this.path       = path;       // modulePathIndex
  this.exportName = exportName; // any
  this.nominalPath= nominalPath;// nominalPath
  this.nominalExportName  = nominalExportName; // any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
exportedNominalModuleBinding.prototype = heir(Bytecode.prototype);

// nominalModuleBinding
function nominalModuleBinding(path, nominalPath) {
  this.path       = path;        // modulePathIndex
  this.nominalPath= nominalPath; // any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
nominalModuleBinding.prototype = heir(Bytecode.prototype);

// exportedModuleBinding
function exportedModuleBinding(path, exportName) {
  this.path       = path;       // modulePathIndex
  this.exportName = exportName; // any
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
exportedModuleBinding.prototype = heir(Bytecode.prototype);

// simpleModuleBinding
function simpleModuleBinding(path) {
  this.path       = path;       // modulePathIndex
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
simpleModuleBinding.prototype = heir(Bytecode.prototype);

// ModuleRename
function ModuleRename(phase, kind, setId, unmarshals, renames, markRenames, plusKern) {
  this.phase      = phase;       // false or exact integer
  this.kind       = kind;        // "marked" or "normal"
  this.unmarshals = unmarshals;  // list of allFromModule
  this.renames    = renames;     // list of (symbol or moduleBinding)
  this.markRenames= markRenames; // any
  this.plusKern   = plusKern;    // boolean
  Bytecode.call(this);
  this.serialize = function(){
    return "";
  };
};
ModuleRename.prototype = heir(Bytecode.prototype);