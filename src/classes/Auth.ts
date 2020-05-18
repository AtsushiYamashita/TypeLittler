import * as _ from "lodash"

import Observer from "./Observer"
import Injecter from "./Injecter"

interface IAuthParsedHash {
    idToken: any,
    idTokenPayload: any
}

interface IAuthOptions {
    clientID: any;
}

export interface IWebAuth {
    checkSession: (a: any, b: (b1: any, b2: any) => any) => any;
    authorize(a: any): any;
    parseHash(a: (a1: any, a2: any) => any): any;
    logout(a: any): any;
}

export interface IWebAuthBuilder {
    build(option: AuthOptions): IWebAuth;
}

type AuthOptions = IAuthOptions;
type AuthParsedHash = Partial<IAuthParsedHash>;
type WebAuth = IWebAuth;
type WebAuthBuilder = IWebAuthBuilder;
type AuthProfile = {
    name: string;
    email: string;
    picture: string;
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
};

export const InjectKey = {
    Key: "Auth_200518_190549",
    AUTH_API_SERVER: () => "http://localhost:8018/authopt2/",
    REACT_SERVER: () => "http://localhost:3000/",
    WebAuthBuilder: (): WebAuthBuilder => ({ build(option: AuthOptions): IWebAuth { throw new Error("mock") } }),
} as const;

const webauthbuilder = Injecter.provide(InjectKey.WebAuthBuilder, InjectKey.Key);
const auth_api = Injecter.provide(InjectKey.AUTH_API_SERVER, InjectKey.Key);
const react_server = Injecter.provide(InjectKey.REACT_SERVER, InjectKey.Key);

class Auth {
    private option: Observer<AuthOptions>;
    private auth0: Observer<IWebAuth>;
    private profile: Observer<AuthProfile>;
    private idToken: Observer<string>;
    private expiresAt: number;

    static init(): Auth {
        const self = new Auth();
        if (!webauthbuilder) throw new Error("WebAuthBuilder had not injected");
        const build = (dat: any) => webauthbuilder.event
            .chain()
            .then(f => f.build(dat))
            .then(self.auth0.push)

        self.option.event.add_shot(build);
        // .add_call(logger<AuthOptions>("L:86"))
        // .chain()
        // .then()
        // .then(self.auth0.update);
        const api = auth_api && auth_api.head
        if (!api) throw new Error("API address had not injected");

        fetch(
            api, {
            credentials: 'same-origin'
        }).then(res => res.json().then(self.option.push))
            .catch(console.error);
        return self;
    }

    private constructor() {
        this.auth0 = new Observer();
        this.option = new Observer();
        this.profile = new Observer();
        this.idToken = new Observer();
        this.expiresAt = -1;

        const ObservedValues = [
            this.auth0,
            this.option,
            this.profile,
            this.idToken,
        ];
        ObservedValues.forEach(e => e
            .rejecter
            .reject(_.isNull)
            .reject(_.isUndefined)
        );
        this.idToken.rejecter
            .reject(_.isString);
        this.profile.event
            // .add_rejector(e => new Date().getTime() < e.exp * 1000)
            .add_notify(v => this.expiresAt = v.exp * 1000);

        // const methods = [
        //     this.silentAuth,
        //     this.signOut,
        //     this.signIn,
        //     this.setSession,
        //     this.self,
        //     this.isAuthenticated,
        //     this.handleAuthentication,
        //     this.getIdToken,
        // ];
        // this.silentAuth = this.silentAuth.bind(this);


        const funcs = _(Object.values(Auth.prototype))
            .map(e => e as Function)
            .filter(_.isFunction)
            .map(e => /*logger<string>("L:136")(e.name) */ e.name)
            .value();
        _.bindAll(this, funcs)
    }

    silentAuth() {
        return new Promise<any[]>((resolve, reject) => {
            this.auth0.event.add_shot(e => e.checkSession({}, (err, token) => {
                if (err) return reject([err]);
                this.setSession(token);
                resolve([]);
            }))
        })
    }

    self() {
        return this;
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated(): boolean {
        // return new Date().getTime() < this.expiresAt;
        return new Date().getTime() < this.expiresAt
    }

    signIn() {
        if (!this) console.error("this is missing")
        console.log("this....", this)
        // const option =
        const auth = (option: any) => this.auth0.event
            .add_shot(e => e.authorize(option));
        this.option.event.add_shot(auth);
        return;
    }

    setSession(authResult: AuthParsedHash) {
        const hash = new Observer<AuthParsedHash>();
        hash.rejecter
            .reject(e => !e)
            .reject(e => !e.idToken)
            .reject(e => !e.idTokenPayload);

        hash.event.chain()
            .then(e => (e.idToken as string))
            .then(this.idToken.push);

        hash.event.chain()
            .then(e => (e.idTokenPayload as AuthProfile))
            .then(this.profile.push);

        return hash.push(authResult);
    }

    handleAuthentication() {
        const to_hash = (user: WebAuth) => new Promise<AuthParsedHash>((res, rej) => {
            user.parseHash((err, hash) => !!err ? rej(err) : res(hash as AuthParsedHash));
        })
        const hash_opt = (user: WebAuth) => _.merge(user, { hash: window.location.hash });

        return new Promise<number[]>((res, rej) => {
            this.auth0.event.chain()
                .then(hash_opt)
                .then(to_hash)
                .then(e => this.setSession(e as AuthParsedHash))
                .then(e => e && res([]))
                .catch(e => rej([102, e]));
        })
    }

    signOut() {
        // clear id token, profile, and expiration
        const returnTo = react_server && react_server.head;
        if (!returnTo) throw new Error("react server had not injected");
        const clientID = this.option.head && this.option.head.clientID;
        if (!clientID) throw new Error("option error");

        this.auth0.event.chain()
            .then(e => e.logout({ returnTo, clientID, }));
        [this.idToken, this.profile].forEach(e => e.unset());
        this.expiresAt = -1;
    }
}

const auth0Client = Auth.init();
// console.log(auth0Client.self())

export default auth0Client.self();
