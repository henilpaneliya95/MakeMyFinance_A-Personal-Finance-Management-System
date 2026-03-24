# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

====================================================================================================================
     |      ^
  14 |
  15 |   useEffect(() => {
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.unexpected (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6647:16)  
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11442:16)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:4794:20)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11076:23)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at JSXParserMixin.parseExpressionBase (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10779:23)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10775:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12422:16) 
      at JSXParserMixin.parseExpression (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10775:17)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12895:23)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseStatementListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12747:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:61)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseBlock (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13297:10) 
      at JSXParserMixin.parseFunctionBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12101:24)
      at JSXParserMixin.parseFunctionBodyAndFinish (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12087:10)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13445:12
      at JSXParserMixin.withSmartMixTopicForbiddingContext (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12404:14)
      at JSXParserMixin.parseFunction (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13444:10)
      at JSXParserMixin.parseFunctionStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13125:17)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12791:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
9:51:18 PM [vite] (client) hmr update /src/App.jsx
9:51:18 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: Missing semicolon. (13:3)       

  11 |       .then(res => setItems(res.data))
  12 |       .catch(err => console.error('Error fetching items:', err));
> 13 |   })
     |    ^
  14 |
  15 |  useEffect(() => {
  16 |     axios.get('http://127.0.0.1:8000/api/items/')
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:13:3
  11 |        .then(res => setItems(res.data))
  12 |        .catch(err => console.error('Error fetching items:', err));
  13 |    })
     |     ^
  14 |
  15 |   useEffect(() => {
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.semicolon (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6923:10)   
      at JSXParserMixin.parseVarStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13231:10)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12851:23)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseStatementListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12747:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:61)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseBlock (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13297:10) 
      at JSXParserMixin.parseFunctionBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12101:24)
      at JSXParserMixin.parseFunctionBodyAndFinish (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12087:10)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13445:12
      at JSXParserMixin.withSmartMixTopicForbiddingContext (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12404:14)
      at JSXParserMixin.parseFunction (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13444:10)
      at JSXParserMixin.parseFunctionStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13125:17)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12791:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:113:33
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:287:14)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
9:51:22 PM [vite] (client) hmr update /src/App.jsx
9:51:22 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: Missing semicolon. (13:3)       

  11 |       .then(res => setItems(res.data))
  12 |       .catch(err => console.error('Error fetching items:', err));
> 13 |   })}
     |    ^
  14 |
  15 |  useEffect(() => {
  16 |     axios.get('http://127.0.0.1:8000/api/items/')
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:13:3
  11 |        .then(res => setItems(res.data))
  12 |        .catch(err => console.error('Error fetching items:', err));
  13 |    })}
     |     ^
  14 |
  15 |   useEffect(() => {
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.semicolon (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6923:10)   
      at JSXParserMixin.parseVarStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13231:10)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12851:23)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseStatementListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12747:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:61)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseBlock (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13297:10) 
      at JSXParserMixin.parseFunctionBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12101:24)
      at JSXParserMixin.parseFunctionBodyAndFinish (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12087:10)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13445:12
      at JSXParserMixin.withSmartMixTopicForbiddingContext (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12404:14)
      at JSXParserMixin.parseFunction (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13444:10)
      at JSXParserMixin.parseFunctionStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13125:17)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12791:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:113:33
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:287:14)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
9:51:28 PM [vite] (client) hmr update /src/App.jsx
9:51:28 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: Missing semicolon. (13:3)       

  11 |       .then(res => setItems(res.data))
  12 |       .catch(err => console.error('Error fetching items:', err));
> 13 |   })}
     |    ^
  14 |
  15 |  
  16 |   const columns = React.useMemo(() => [
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:13:3
  11 |        .then(res => setItems(res.data))
  12 |        .catch(err => console.error('Error fetching items:', err));
  13 |    })}
     |     ^
  14 |
  15 |
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.semicolon (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6923:10)   
      at JSXParserMixin.parseVarStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13231:10)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12851:23)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseStatementListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12747:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:61)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseBlock (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13297:10) 
      at JSXParserMixin.parseFunctionBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12101:24)
      at JSXParserMixin.parseFunctionBodyAndFinish (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12087:10)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13445:12
      at JSXParserMixin.withSmartMixTopicForbiddingContext (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12404:14)
      at JSXParserMixin.parseFunction (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13444:10)
      at JSXParserMixin.parseFunctionStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13125:17)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12791:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:113:33
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:287:14)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
9:51:34 PM [vite] (client) hmr update /src/App.jsx
9:51:34 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: 'return' outside of function. (28:2)

  26 |     useTable({ columns, data });
  27 |
> 28 |   return (
     |   ^
  29 |     <div className='item-main'>
  30 |       <h1>Full Stack Demo</h1>
  31 |
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:28:2
  26 |      useTable({ columns, data });
  27 |
  28 |    return (
     |    ^
  29 |      <div className='item-main'>
  30 |        <h1>Full Stack Demo</h1>
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.parseReturnStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13136:12)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12798:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:113:33
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:287:14)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
9:51:40 PM [vite] (client) hmr update /src/App.jsx
9:51:40 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: 'return' outside of function. (29:2)

  27 |     useTable({ columns, data });
  28 |
> 29 |   return (
     |   ^
  30 |     <div className='item-main'>
  31 |       <h1>Full Stack Demo</h1>
  32 |
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:29:2
  27 |      useTable({ columns, data });
  28 |
  29 |    return (
     |    ^
  30 |      <div className='item-main'>
  31 |        <h1>Full Stack Demo</h1>
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.parseReturnStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13136:12)
      at JSXParserMixin.parseStatementContent (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12798:21)
      at JSXParserMixin.parseStatementLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12767:17)
      at JSXParserMixin.parseModuleItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12744:17)
      at JSXParserMixin.parseBlockOrModuleBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13316:36)
      at JSXParserMixin.parseBlockBody (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13309:10)
      at JSXParserMixin.parseProgram (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12625:10)
      at JSXParserMixin.parseTopLevel (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12615:25)
      at JSXParserMixin.parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14492:10)      
      at parse (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:14526:38)
      at parser (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\parser\index.js:41:34)
      at parser.next (<anonymous>)
      at normalizeFile (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37)
      at normalizeFile.next (<anonymous>)
      at run (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transformation\index.js:22:50)
      at run.next (<anonymous>)
      at transform (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\transform.js:22:33)
      at transform.next (<anonymous>)
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:261:32)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:189:28
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\core\lib\gensync-utils\async.js:67:7
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:113:33
      at step (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:287:14)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:273:13
      at async.call.result.err.err (C:\Users\Excel\Desktop\demo\item_web\node_modules\gensync\index.js:223:11)
9:52:22 PM [vite] (client) hmr update /src/App.jsx
9:53:16 PM [vite] (client) hmr update /src/App.jsx (x2)
9:55:05 PM [vite] (client) hmr update /src/App.jsx (x3)
9:55:05 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: Unexpected token (35:30)        

  33 |
  34 |   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
> 35 |     useTable({ columns, data: });
     |                               ^
  36 |
  37 |   return (
  38 |     <div className="item-main">
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:35:30
  33 |  
  34 |    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  35 |      useTable({ columns, data: });
     |                                ^
  36 |
  37 |    return (
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.unexpected (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6647:16)  
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11442:16)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:4794:20)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11076:23)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12427:12) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12494:17)
      at JSXParserMixin.parseObjectProperty (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11951:83)
      at JSXParserMixin.parseObjPropValue (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11979:100)
      at JSXParserMixin.parsePropertyDefinition (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11916:17)
      at JSXParserMixin.parseObjectLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11831:21)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11334:23)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:4794:20)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11076:23)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12427:12) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12494:17)
      at JSXParserMixin.parseExprListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12176:18)
      at JSXParserMixin.parseCallExpressionArguments (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11247:22)
      at JSXParserMixin.parseCoverCallAndAsyncArrowHead (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11181:29)
      at JSXParserMixin.parseSubscript (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11115:19)
      at JSXParserMixin.parseSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11089:19)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11080:17)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12422:16) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseVar (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13384:91)   
      at JSXParserMixin.parseVarStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13230:10)
9:55:07 PM [vite] (client) hmr update /src/App.jsx
9:55:21 PM [vite] (client) hmr update /src/App.jsx (x2)
9:56:17 PM [vite] (client) hmr update /src/App.jsx (x3)
9:56:17 PM [vite] Internal server error: C:\Users\Excel\Desktop\demo\item_web\src\App.jsx: Unexpected token (35:30)        

  33 |
  34 |   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
> 35 |     useTable({ columns, data: });
     |                               ^
  36 |
  37 |   return (
  38 |     <div className="item-main">
  Plugin: vite:react-babel
  File: C:/Users/Excel/Desktop/demo/item_web/src/App.jsx:35:30
  33 |  
  34 |    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  35 |      useTable({ columns, data: });
     |                                ^
  36 |
  37 |    return (
      at constructor (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:367:19)
      at JSXParserMixin.raise (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6627:19)       
      at JSXParserMixin.unexpected (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:6647:16)  
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11442:16)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:4794:20)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11076:23)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12427:12) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12494:17)
      at JSXParserMixin.parseObjectProperty (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11951:83)
      at JSXParserMixin.parseObjPropValue (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11979:100)
      at JSXParserMixin.parsePropertyDefinition (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11916:17)
      at JSXParserMixin.parseObjectLike (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11831:21)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11334:23)
      at JSXParserMixin.parseExprAtom (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:4794:20)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11076:23)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12427:12) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12494:17)
      at JSXParserMixin.parseExprListItem (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12176:18)
      at JSXParserMixin.parseCallExpressionArguments (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11247:22)
      at JSXParserMixin.parseCoverCallAndAsyncArrowHead (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11181:29)
      at JSXParserMixin.parseSubscript (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11115:19)
      at JSXParserMixin.parseSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11089:19)
      at JSXParserMixin.parseExprSubscripts (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11080:17)
      at JSXParserMixin.parseUpdate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11061:21)      at JSXParserMixin.parseMaybeUnary (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:11041:23)
      at JSXParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10894:61)
      at JSXParserMixin.parseExprOps (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10899:23)
      at JSXParserMixin.parseMaybeConditional (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10876:23)
      at JSXParserMixin.parseMaybeAssign (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10826:21)
      at C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:39
      at JSXParserMixin.allowInAnd (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:12422:16) 
      at JSXParserMixin.parseMaybeAssignAllowIn (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:10795:17)
      at JSXParserMixin.parseVar (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13384:91)   
      at JSXParserMixin.parseVarStatement (C:\Users\Excel\Desktop\demo\item_web\node_modules\@babel\parser\lib\index.js:13230:10)
9:56:19 PM [vite] (client) hmr update /src/App.jsx
(.venv) PS C:\Users\Excel\Desktop\demo\item_web> npm run dev

> item_web@0.0.0 dev
> vite


  VITE v7.0.2  ready in 671 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
9:57:44 PM [vite] (client) hmr update /src/App.jsx
': [Errno 2] No such file or directory
(.venv) PS C:\Users\Excel\Desktop\demo\item_web> cd .. python manage.py runserver
+ cd .. python manage.py runserver
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Set-Location], ParameterBindingException
    + FullyQualifiedErrorId : PositionalParameterNotFound,Microsoft.PowerShell.Commands.SetLocationCommand
 
(.venv) PS C:\Users\Excel\Desktop\demo\item_web> cd ..
(.venv) PS C:\Users\Excel\Desktop\demo> python manage.py runserver      
C:\Users\Excel\Desktop\demo\.venv\Scripts\python.exe: can't open file 'C:\\Users\\Excel\\Desktop\\demo\\manage.py': [Errno 
2] No such file or directory
(.venv) PS C:\Users\Excel\Desktop\demo> cd item_service
(.venv) PS C:\Users\Excel\Desktop\demo\item_service> python manage.py runserver
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
Exception in thread django-main-thread:
Traceback (most recent call last):
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\servers\basehttp.py", line 48, in get_internal_wsgi_application
    return import_string(app_path)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\module_loading.py", line 30, in import_string     
    return cached_import(module_path, class_name)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\module_loading.py", line 15, in cached_import     
    module = import_module(module_path)
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\importlib\__init__.py", line 88, in import_module       
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1022, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\Excel\Desktop\demo\item_service\item_service\wsgi.py", line 16, in <module>
    application = get_wsgi_application()
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\wsgi.py", line 13, in get_wsgi_application
    return WSGIHandler()
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\handlers\wsgi.py", line 118, in __init__
    self.load_middleware()
    ~~~~~~~~~~~~~~~~~~~~^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\handlers\base.py", line 40, in load_middleware     
    middleware = import_string(middleware_path)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\module_loading.py", line 30, in import_string     
    return cached_import(module_path, class_name)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\module_loading.py", line 15, in cached_import
    module = import_module(module_path)
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\importlib\__init__.py", line 88, in import_module       
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1310, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1324, in _find_and_load_unlocked
ModuleNotFoundError: No module named 'corSheaders'

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\threading.py", line 1041, in _bootstrap_inner
    self.run()
    ~~~~~~~~^^
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\threading.py", line 992, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\autoreload.py", line 64, in wrapper
    fn(*args, **kwargs)
    ~~^^^^^^^^^^^^^^^^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\management\commands\runserver.py", line 143, in inner_run
    handler = self.get_handler(*args, **options)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\contrib\staticfiles\management\commands\runserver.py", line 31, in get_handler
    handler = super().get_handler(*args, **options)
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\management\commands\runserver.py", line 73, in get_handler
    return get_internal_wsgi_application()
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\servers\basehttp.py", line 50, in get_internal_wsgi_application
    raise ImproperlyConfigured(
    ...<2 lines>...
    ) from err
django.core.exceptions.ImproperlyConfigured: WSGI application 'item_service.wsgi.application' could not be loaded; Error importing module.
C:\Users\Excel\Desktop\demo\item_service\item_service\settings.py changed, reloading.
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
July 04, 2025 - 22:04:26
Django version 5.2.4, using settings 'item_service.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
C:\Users\Excel\Desktop\demo\item_service\item_service\settings.py changed, reloading.
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
July 04, 2025 - 22:04:54
Django version 5.2.4, using settings 'item_service.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
C:\Users\Excel\Desktop\demo\item_service\item_service\settings.py changed, reloading.
Watching for file changes with StatReloader
Performing system checks...

Exception in thread django-main-thread:
Traceback (most recent call last):
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\threading.py", line 1041, in _bootstrap_inner
    self.run()
    ~~~~~~~~^^
  File "C:\Users\Excel\AppData\Local\Programs\Python\Python313\Lib\threading.py", line 992, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\utils\autoreload.py", line 64, in wrapper
    fn(*args, **kwargs)
    ~~^^^^^^^^^^^^^^^^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\management\commands\runserver.py", line 134, in inner_run
    self.check(**check_kwargs)
    ~~~~~~~~~~^^^^^^^^^^^^^^^^
  File "C:\Users\Excel\Desktop\demo\.venv\Lib\site-packages\django\core\management\base.py", line 569, in check
    raise SystemCheckError(msg)
django.core.management.base.SystemCheckError: SystemCheckError: System check identified some issues:

ERRORS:
?: (admin.E410) 'django.contrib.sessions.middleware.SessionMiddleware' must be in MIDDLEWARE in order to use the admin application.
        HINT: Insert 'django.contrib.sessions.middleware.SessionMiddleware' before 'django.contrib.auth.middleware.AuthenticationMiddleware'.

System check identified 1 issue (0 silenced).
C:\Users\Excel\Desktop\demo\item_service\item_service\settings.py changed, reloading.
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
July 04, 2025 - 22:05:05
Django version 5.2.4, using settings 'item_service.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
Not Found: /
[04/Jul/2025 22:05:20] "GET / HTTP/1.1" 404 3279
[04/Jul/2025 22:06:28] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:06:28] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:06:32] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:06:32] "GET /api/items/ HTTP/1.1" 200 65
Not Found: /
[04/Jul/2025 22:06:41] "GET / HTTP/1.1" 404 3279
Not Found: /api/items/2/
[04/Jul/2025 22:06:46] "GET /api/items/2/ HTTP/1.1" 404 5325
[04/Jul/2025 22:06:46] "GET /static/rest_framework/css/bootstrap.min.css HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/css/bootstrap-tweaks.css HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/ajax-form.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/css/default.css HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/csrf.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/css/prettify.css HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/bootstrap.min.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/jquery-3.7.1.min.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/default.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/load-ajax-form.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/js/prettify-min.js HTTP/1.1" 304 0
[04/Jul/2025 22:06:46] "GET /static/rest_framework/img/grid.png HTTP/1.1" 304 0
[04/Jul/2025 22:06:54] "GET /api/items/1/ HTTP/1.1" 200 5412
[04/Jul/2025 22:07:43] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:07:43] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:07:44] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:07:44] "GET /api/items/ HTTP/1.1" 200 65
C:\Users\Excel\Desktop\demo\item_service\item_service\settings.py changed, reloading.
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
July 04, 2025 - 22:09:55
Django version 5.2.4, using settings 'item_service.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
[04/Jul/2025 22:09:57] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:09:57] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:15:49] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:15:49] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:15:59] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:16:04] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:16:07] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:16:16] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:17:49] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:17:49] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:21:28] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:21:28] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:22:22] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:22:22] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:23:16] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:23:16] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:25:45] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:25:45] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:28:54] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:28:57] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:28:57] "GET /api/items/ HTTP/1.1" 200 65
[04/Jul/2025 22:29:23] "OPTIONS /api/items/ HTTP/1.1" 200 0
[04/Jul/2025 22:29:23] "POST /api/items/ HTTP/1.1" 201 55
[04/Jul/2025 22:29:23] "GET /api/items/ HTTP/1.1" 200 121
[04/Jul/2025 22:29:41] "POST /api/items/ HTTP/1.1" 201 57
[04/Jul/2025 22:29:41] "GET /api/items/ HTTP/1.1" 200 179
Bad Request: /api/items/
[04/Jul/2025 22:31:58] "POST /api/items/ HTTP/1.1" 400 82
[04/Jul/2025 22:32:05] "POST /api/items/ HTTP/1.1" 201 52
[04/Jul/2025 22:32:05] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:34:29] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:34:29] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:36:05] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:36:05] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:37:02] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:37:02] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:37:29] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:37:29] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:38:38] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:38:38] "GET /api/items/ HTTP/1.1" 200 232
[04/Jul/2025 22:44:50] "POST /api/items/ HTTP/1.1" 201 52
[04/Jul/2025 22:44:50] "GET /api/items/ HTTP/1.1" 200 285
[04/Jul/2025 22:44:56] "POST /api/items/ HTTP/1.1" 201 57
[04/Jul/2025 22:44:56] "GET /api/items/ HTTP/1.1" 200 343
[04/Jul/2025 22:45:11] "POST /api/items/ HTTP/1.1" 201 57
[04/Jul/2025 22:45:11] "GET /api/items/ HTTP/1.1" 200 401
[04/Jul/2025 22:51:32] "GET /api/items/ HTTP/1.1" 200 401
[04/Jul/2025 22:51:32] "GET /api/items/ HTTP/1.1" 200 401
[04/Jul/2025 22:51:48] "OPTIONS /api/items/8/update/ HTTP/1.1" 200 0
[04/Jul/2025 22:51:48] "PUT /api/items/8/update/ HTTP/1.1" 201 60
[04/Jul/2025 22:51:48] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:52:04] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:52:04] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:52:52] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:52:52] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:53:11] "OPTIONS /api/items/3/update/ HTTP/1.1" 200 0
[04/Jul/2025 22:53:11] "PUT /api/items/3/update/ HTTP/1.1" 201 55
[04/Jul/2025 22:53:11] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 22:53:14] "OPTIONS /api/items/1/update/ HTTP/1.1" 200 0
[04/Jul/2025 22:53:14] "PUT /api/items/1/update/ HTTP/1.1" 201 63
[04/Jul/2025 22:53:14] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 23:01:30] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 23:01:30] "GET /api/items/ HTTP/1.1" 200 404
[04/Jul/2025 23:01:32] "OPTIONS /api/items/1/delete/ HTTP/1.1" 200 0
[04/Jul/2025 23:01:32] "DELETE /api/items/1/delete/ HTTP/1.1" 204 0
[04/Jul/2025 23:01:32] "GET /api/items/ HTTP/1.1" 200 340
[04/Jul/2025 23:01:33] "GET /api/items/ HTTP/1.1" 200 340
[04/Jul/2025 23:01:33] "GET /api/items/ HTTP/1.1" 200 340
[04/Jul/2025 23:01:37] "OPTIONS /api/items/8/delete/ HTTP/1.1" 200 0
[04/Jul/2025 23:01:37] "DELETE /api/items/8/delete/ HTTP/1.1" 204 0
[04/Jul/2025 23:01:37] "GET /api/items/ HTTP/1.1" 200 279
[04/Jul/2025 23:01:38] "GET /api/items/ HTTP/1.1" 200 279
[04/Jul/2025 23:01:38] "GET /api/items/ HTTP/1.1" 200 279
Bad Request: /api/items/
[04/Jul/2025 23:01:40] "POST /api/items/ HTTP/1.1" 400 129
[04/Jul/2025 23:01:49] "POST /api/items/ HTTP/1.1" 201 61
[04/Jul/2025 23:01:49] "GET /api/items/ HTTP/1.1" 200 341
Bad Request: /api/items/
[04/Jul/2025 23:01:59] "POST /api/items/ HTTP/1.1" 400 129
[04/Jul/2025 23:02:03] "OPTIONS /api/items/4/delete/ HTTP/1.1" 200 0
[04/Jul/2025 23:02:03] "DELETE /api/items/4/delete/ HTTP/1.1" 204 0
[04/Jul/2025 23:02:03] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:02:03] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:02:03] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:03:05] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:03:10] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:03:10] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:04:54] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:05:05] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:06:07] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:06:11] "PUT /api/items/3/update/ HTTP/1.1" 201 55
[04/Jul/2025 23:06:11] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:06:23] "POST /api/items/ HTTP/1.1" 201 55
[04/Jul/2025 23:06:23] "GET /api/items/ HTTP/1.1" 200 339
[04/Jul/2025 23:06:27] "OPTIONS /api/items/10/delete/ HTTP/1.1" 200 0
[04/Jul/2025 23:06:27] "DELETE /api/items/10/delete/ HTTP/1.1" 204 0
[04/Jul/2025 23:06:27] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:06:27] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:06:27] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:09:55] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:09:55] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:04] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:07] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:13] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:15] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:34] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:10:38] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:14:28] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:14:28] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:14:31] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:14:31] "GET /api/items/ HTTP/1.1" 200 283
[04/Jul/2025 23:15:00] "OPTIONS /api/items/3/delete/ HTTP/1.1" 200 0
[04/Jul/2025 23:15:00] "DELETE /api/items/3/delete/ HTTP/1.1" 204 0
[04/Jul/2025 23:15:00] "GET /api/items/ HTTP/1.1" 200 227
[04/Jul/2025 23:15:01] "GET /api/items/ HTTP/1.1" 200 227
[04/Jul/2025 23:15:01] "GET /api/items/ HTTP/1.1" 200 227
[04/Jul/2025 23:15:31] "POST /api/items/ HTTP/1.1" 201 64
[04/Jul/2025 23:15:31] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:17:28] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:17:29] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:22:41] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:22:41] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:23:17] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:23:17] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:26:50] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:26:50] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:27:12] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:27:18] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:36:24] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:36:24] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:37:46] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:37:46] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:40:10] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:40:10] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:41:47] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:41:47] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:42:18] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:42:18] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:44:28] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:44:28] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:45:15] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:45:19] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:45:21] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:45:23] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:45:30] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:47:53] "OPTIONS /api/items/11/update/ HTTP/1.1" 200 0
[04/Jul/2025 23:47:53] "PUT /api/items/11/update/ HTTP/1.1" 201 64
[04/Jul/2025 23:47:53] "GET /api/items/ HTTP/1.1" 200 292
[04/Jul/2025 23:48:14] "GET /api/items/ HTTP/1.1" 200 292

