class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            show: "",
            showAbout: false,
        }

    }

    componentDidMount() {
        // const svg = document.getElementById('corgi-art');
        const svg = ReactDOM.findDOMNode(this.refs.svg);

        svg.addEventListener('load', this.animate);

        // select this entire node

        const name = ReactDOM.findDOMNode(this.refs.name);
        const links = ReactDOM.findDOMNode(this.refs.links);
        const works = ReactDOM.findDOMNode(this.refs.works);
        const love = ReactDOM.findDOMNode(this.refs.love);

        // animate name, title, and any other bits once component mounts
        TweenMax.from(name, .7, {y: "-=50", opacity: 0, ease: Power1.easeOut, delay: .7});
        TweenMax.from(works, .7, {y: "-=50", opacity: 0, ease: Power1.easeOut, delay: 1.2});

        new TimelineMax()
            // links
            .to(links, 0, {scale: 1, ease: Linear.noEase}, "-=0")
            .to(links, 1, {opacity: 1, ease: Linear.noEase}, "-=0")

            // heart appears in lower right corner of window
            .to(love, .5, {
                opacity: 1,
                display: 'block',
                ease: Power4.easeOut
            }, "-=.5")


    }

    showDiagram = (pic) => {
        switch (pic) {
            case "love":
                this.setState({show: "love"});
                this.setState({showAbout: <div>SVG art designed in Adobe Illustrator, animated with GSAP</div>});
                break;
            case "dorta":
                this.setState({show: "dorta"});
                this.setState({
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>hackathon fighting game built with HTML5
                        canvas & Socket.IO</div>
                });
                break;
            case "aga":
                this.setState({show: "aga"});
                this.setState({
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>planetary multiplayer game built with
                        React, Redux, Three.js, Cannon.js, & Socket.IO</div>
                });
                break;
            case "afia":
                this.setState({show: "afia"});
                this.setState({
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>UX prototype for a decentralized,
                        personal health record app. 1st place entry for 2017 #DecentralizeTheWeb challenge</div>
                });
                break;
        }
    }

    hideDiagram = () => {
        this.setState({show: ""});
        this.setState({showAbout: false})
    }

    animate = () => {
        const svg = ReactDOM.findDOMNode(this.refs.svg);

        // Must run in localhost, doesn't load contentDocument if running HMTL locally.
        const corgi = svg.contentDocument;

        const leftpaw = corgi.getElementById("leftpaw");
        const rightpaw = corgi.getElementById("rightpaw");
        const mouse = corgi.getElementById("mouse");

        // Corgi hits keyboard, and code pops out toaster.
        const keyboardTl = new TimelineMax();
        const toasterTl = new TimelineMax({
            autoRemoveChildren: true,
            onComplete: () => toasterhasPopped = !toasterhasPopped,
        });

        keyboardTl
            .to(leftpaw, .2, {rotation: 5, x: "-=1", y: "-=5"})
            .to(leftpaw, .1, {rotation: -7, x: "-=1", y: "+=4"})
            .to(leftpaw, .1, {rotation: 4, x: "+=1", y: "-=2"})
            .to(leftpaw, .2, {rotation: -2, x: "+=1", y: "+=3"})
            .pause()

        corgi.addEventListener('click', () => popToaster(corgi, keyboardTl, toasterTl));
        corgi.addEventListener('mousemove', ({
                                                 movementX,
                                                 movementY
                                             }) => moveMouse(rightpaw, mouse, movementX, movementY));
        window.addEventListener('deviceorientation', ({
                                                          beta,
                                                          gamma
                                                      }) => moveMouse(rightpaw, mouse, ...rotationToTranslation(beta, gamma)));
    }

    rotationToTranslation = (beta, gamma) => {
        beta = beta / 180 * 20;
        gamma = gamma / 90 * 20;

        switch (window.orientation) {
            case 0:
                return [gamma, beta]
            case 90:
                return [beta, -gamma];
            case 180:
                return [-gamma, -beta];
            case -90:
                return [-beta, gamma];
        }

        return [0, 0];
    }

    moveMouse = (rightpaw, mouse, x, y) => {
        // Smooth animation for mouse movement.
        if (window.orientation == null) {
            rightpaw.style.transition = 'transform .1s ease-in-out';
            mouse.style.transition = 'transform .1s ease-in-out';
        }

        // Limit magnitude of movement.
        const angle = Math.atan(y / x) || 0;
        const limitX = Math.abs(Math.cos(angle)) * 3;
        const limitY = Math.abs(Math.sin(angle)) * 3;

        x = Math.max(-limitX, Math.min(limitX, x));
        y = Math.max(-limitY, Math.min(limitY, y));

        rightpaw.style.transform = `translate(${x}px, ${y}px)`;
        mouse.style.transform = `translate(${x}px, ${y}px)`;
    }

    popToaster = (corgi, keyboardTl, toasterTl) => {
        const codea = corgi.getElementById("codea");
        const codeb = corgi.getElementById("codeb");
        const toasterSwitch = corgi.getElementById("switch");

        if (!keyboardTl.isActive() && !toasterTl.isActive()) {

            keyboardTl.restart();

            if (!toasterhasPopped) {
                toasterTl
                    .to(codea, .8, {y: "-=16", ease: Elastic.easeOut}, "+=.4")
                    .to(codeb, .8, {y: "-=16", ease: Elastic.easeOut}, "-=.8")
                    .to(toasterSwitch, .4, {y: "-=18", ease: Elastic.easeOut.config(1, .8)}, "-=.8")
            } else {
                toasterTl
                    .to(codea, .6, {y: "+=16"}, "+=.4")
                    .to(codeb, .6, {y: "+=16"}, "-=.6")
                    .to(toasterSwitch, .6, {y: "+=18"}, "-=.6")
            }
        }
    }

    render() {
        return (
            <div className="container-fluid">
                {this.images()}

                <div ref="name" id="name">
                    <object style={this.state.show ? {opacity: 0} : {opacity: 1}} ref="svg"
                            data="siggy.svg" type="image/svg+xml" width={"100%"}/>
                </div>

                <object style={this.state.show ? {opacity: 0} : {opacity: 1}} ref="svg"
                        data="/corgi-art.svg" type="image/svg+xml" width={"100%"}/>

                <div ref="works" id="works" className="text-center">
                    <div onMouseOver={() => this.showDiagram("aga")} onMouseLeave={this.hideDiagram}>
                        <a href="https://agamari.herokuapp.com" target="_blank">Agamari</a>
                    </div>
                    <div onMouseOver={() => this.showDiagram("afia")} onMouseLeave={this.hideDiagram}>
                        <a href="https://projects.invisionapp.com/share/PXAF8L8YJ" target="_blank">Afia</a>
                    </div>
                    <div onMouseOver={() => this.showDiagram("dorta")} onMouseLeave={this.hideDiagram}>
                        <a href="https://dorta.herokuapp.com" target="_blank">Dorta</a>
                    </div>
                </div>

                <div ref="links" className="links">
                    <a href="https://github.com/kentywang/" target="_blank">
                        <i className="fa fa-github"></i>
                    </a>
                </div>
                <div ref="love" id="love" onMouseOver={() => this.showDiagram("love")}
                     onMouseLeave={this.hideDiagram}>
                    {this.state.showAbout && <span id="about">{this.state.showAbout}</span>}
                    <i className="fa fa-heart"
                       style={this.state.show === "aga" || this.state.show === "dorta" ? {color: "white"} : {}}></i>
                </div>

            </div>
        )
    }

    images = () => (
        <React.Fragment>
            <img style={this.state.show === "love" ? {
                margin: "25% 16%",
                maxWidth: "70%",
                maxHeight: "70%"
            } : {display: "none"}} src="corgi-diagram.png"/>
            <img style={this.state.show === "dorta" ? {
                display: "inline",
                position: "fixed",
                opacity: .65,
                top: "50%",
                left: "50%",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                transform: "translate(-50%, -50%)"
            } : {display: "none"}} src="dorta.gif"/>
            <video style={this.state.show === "aga" ? {
                display: "inline",
                position: "fixed",
                opacity: .9,
                top: "50%",
                left: "50%",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                transform: "translate(-50%, -50%)"
            } : {display: "none"}} playsInline autoPlay muted loop src="agamari.mp4"
                   type="video/mp4"/>
            <video style={this.state.show === "afia" ? {
                display: "inline",
                position: "fixed",
                opacity: .9,
                top: "50%",
                left: "50%",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                transform: "translate(-50%, -50%)"
            } : {display: "none"}} playsInline autoPlay muted loop src="afia.mp4"
                   type="video/mp4"/>
        </React.Fragment>
    )
}

ReactDOM.render(<Main/>,
    document.getElementById('app')
);

let toasterhasPopped = true;

