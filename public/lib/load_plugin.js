import { functions as functionsRegistry } from 'plugins/canvas/lib/functions';

import functions from '../functions';

functions.forEach(fnDef => functionsRegistry.register(fnDef));
