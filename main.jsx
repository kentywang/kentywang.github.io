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
        const works = ReactDOM.findDOMNode(this.refs.works);
        const love = ReactDOM.findDOMNode(this.refs.love);

        // animate name, title, and any other bits once component mounts
        // TweenMax.from(name, .7, {y: "-=50", opacity: 0, ease: Power1.easeOut, delay: .7});
        // TweenMax.from(works, .7, {y: "-=50", opacity: 0, ease: Power1.easeOut, delay: 1.2});
    }

    showDiagram = (pic) => {

        switch (pic) {
            case "love":
                this.setState({
                    show: "love",
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>SVG art designed in Adobe Illustrator,
                        animated with GSAP</div>
                });
                break;
            case "dorta":
                this.setState({
                    show: "dorta",
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>hackathon fighting game built with HTML5
                        canvas & Socket.IO</div>
                });
                break;
            case "aga":
                this.setState({
                    show: "aga",
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>planetary multiplayer game built with
                        React, Redux, Three.js, Cannon.js, & Socket.IO</div>
                });
                break;
            case "afia":
                this.setState({
                    show: "afia",
                    showAbout: <div style={{fontWeight: "600", color: "white"}}>UX prototype for a decentralized,
                        personal health record app. 1st place entry for 2017 #DecentralizeTheWeb challenge</div>
                });
                break;
        }
    }

    hideDiagram = () => {
        this.setState({
            show: "",
            showAbout: false
        });
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
        const {show, showAbout} = this.state;

        const works = [
            {id: "afia", name: "Afia", url: "https://github.com/kentywang/Afia"},
            {id: "aga", name: "Agamari", url: "http://vmnckpwxor.us17.qoddiapp.com"},
            {id: "dorta", name: "Dorta", url: "https://github.com/kentywang/Dorta"},
            {id: "flywheel", name: "Flywheel", url: "https://github.com/kentywang/Flywheel"},
            {id: "origami", name: "Origami", url: "https://github.com/kentywang/Origami"},
            {id: "scheme", name: "SCHEME--", url: "https://github.com/kentywang/scheme--"},
            {id: "wishlights", name: "Wishlights", url: "https://github.com/kentywang/Wishlights"},
        ]

        return (
            <div className="container">
                {this.images(show)}

                <div ref="name" id="name" className="container-sm">
                    <object style={{maxHeight: "20vh"}} className={show ? "invisible" : "visible"} ref="svg"
                            data="siggy.svg" type="image/svg+xml" width={"100%"}/>
                </div>

                <div className="row">
                    <div id="corgi" className="col-md-6">
                        <object className={show ? "invisible" : "visible"} ref="svg"
                                data="corgi-art.svg" type="image/svg+xml" width={"100%"}/>
                    </div>
                    <div ref="works" id="works" className="col-md-6 text-center">
                        {show !== "love" &&
                            works.map(({id, name, url}) => (
                                <div key={id}
                                     onMouseOver={() => this.showDiagram(id)}
                                     onMouseLeave={this.hideDiagram}
                                     className={(showAbout && show !== id) ? "invisible" : "visible"}
                                >
                                    <a href={url} target="_blank">
                                        {name}
                                    </a>
                                </div>
                            ))
                        }
                    < /div>
                </div>

                <div ref="love" id="love" onMouseOver={() => this.showDiagram("love")}
                     onMouseLeave={this.hideDiagram}>
                    {showAbout && <span id="about">{showAbout}</span>}
                    <i className="fa fa-heart"
                       style={show || showAbout ? {color: "white"} : {}}></i>
                </div>

            </div>
        )
    }

    images = (show) => (
        <React.Fragment>
            <img className={show === "love" ? "fullscreen-love" : "hide"} src="corgi-diagram.png"/>
            <img className={show === "dorta" ? "fullscreen" : "hide"} src="dorta.gif"/>
            <video className={show === "aga" ? "fullscreen" : "hide"} playsInline autoPlay muted loop src="agamari.mp4"
                   type="video/mp4"/>
            <video className={show === "afia" ? "fullscreen" : "hide"} playsInline autoPlay muted loop src="afia.mp4"
                   type="video/mp4"/>
        </React.Fragment>
    )
}

ReactDOM.render(<Main/>,
    document.getElementById('app')
);

let toasterhasPopped = true;

