import { functions as functionsRegistry } from 'plugins/canvas/lib/functions';
import { viewRegistry } from 'plugins/canvas/expression_types';

import functions from '../functions';
import expressionTypes from '../expression_types';

functions.forEach(fnDef => functionsRegistry.register(fnDef));
expressionTypes.forEach(expDef => viewRegistry.register(expDef));
