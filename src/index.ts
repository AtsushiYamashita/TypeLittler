import { PathValue } from "./classes/PathValue"
import {
    Observer,
    SafeValue,
    Rejector,
    Event,
} from "./classes/Observer"
import { Identity, Injecter, } from "./classes/Injecter"
import { CaseAction, ConditinalCache } from "./classes/ConditionalCache"

import * as Add from "./functions/add"
import * as TryHandle from "./functions/try_handle"
import * as Hash from "./functions/hash"

export const TypeLittler = {
    PathValue,
    Observer,
    SafeValue,
    Rejector,
    Event,
    Identity,
    Injecter,
    CaseAction,
    ConditinalCache,

    Add,
    TryHandle,
    Hash
} as const

export default TypeLittler
