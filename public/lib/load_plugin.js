import { functionsRegistry } from 'plugins/canvas/lib/functions';
import { elementsRegistry } from 'plugins/canvas/lib/elements';
import { viewRegistry } from 'plugins/canvas/expression_types';

import functions from '../functions';
import elements from '../elements';
import expressionTypes from '../expression_types';

functions.forEach(fnDef => functionsRegistry.register(fnDef));
elements.forEach(elDef => elementsRegistry.register(elDef));
expressionTypes.forEach(expDef => viewRegistry.register(expDef));
