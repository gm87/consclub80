import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Spinner from "react-bootstrap/Spinner"
import SidebarWithContent from "../layouts/SidebarWithContent"
import States from "../assets/states.json"
import { useState } from "react"
import { Link } from "react-router-dom"
import CognitoUserAttributes from "../models/CognitoUserAttributes"

interface SponsorshipFormProps {
    user: CognitoUserAttributes | null
}

interface SponsorshipFormData {
    SponsorName: string
    ApplicantName: string
    Address1: string
    Address2: string
    City: string
    State: string
    Zip: string
    Phone: string
    Spouse: string
    Children: string[]
    Drugs: boolean | null
    SexOffender: boolean | null
    Reasons: string
}

const SponsorshipForm = ({ user }: SponsorshipFormProps) => {

    const [error, setError] = useState<string[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [data, setData] = useState<SponsorshipFormData>({
        SponsorName: '',
        ApplicantName: '',
        Address1: '',
        Address2: '',
        City: '',
        State: '',
        Zip: '',
        Phone: '',
        Spouse: '',
        Children: [],
        Drugs: null,
        SexOffender: null,
        Reasons: ''
    })

    const handlePhoneChange = (e: any) => {
        const phone = ('' + e.target.value).replace(/\D/g, '')
        let formattedPhone = ``
        if (phone.length <= 3)
            formattedPhone = phone
        else if (phone.length <= 6)
            formattedPhone = `${phone.substring(0, 3)}-${phone.substring(3, phone.length)}`
        else if (phone.length >= 11)
            formattedPhone = `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
        else
            formattedPhone = `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, phone.length)}`
        setData({ ...data, Phone: formattedPhone })
    }

    const renderStateOption = ({ name, abbreviation }: { name: string, abbreviation: string }) => {
        return (
            <option key={abbreviation} value={abbreviation}>{name}</option>
        )
    }

    const handleSubmit = () => {
        let errors = []
        if (!data.SponsorName)
            errors.push(`You must enter the Sponsor's name.`)
        if (!data.ApplicantName)
            errors.push(`You must enter the Applicant's name.`)
        if (!data.Address1)
            errors.push(`You must include your address.`)
        if (!data.City)
            errors.push(`You must enter your city.`)
        if (!data.State)
            errors.push(`You must enter your state.`)
        if (!data.Zip)
            errors.push(`You must enter your zip code.`)
        if (!data.Phone)
            errors.push(`You must enter your phone.`)
        if (data.Drugs === null)
            errors.push(`You must specifcy if you've been convicted of a drug charge.`)
        if (data.SexOffender === null)
            errors.push(`You must specify if you're required to register as a sex offender.`)
        if (errors.length > 0)
            setError(errors)
        else {
            setLoading(true)
            fetch(`https://api.80sconservationclub.com/sponsorship`, {
                body: JSON.stringify(data),
                method: "POST"
            })
            .then(response => response.json())
            .then(json => {
                if (json.statusCode === 200) {
                    setSuccess(true)
                    setLoading(false)
                }
                else {
                    setError(['Something went wrong. Try again later.'])
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
            })
        }
    }

    if (success) {
        return (
            <SidebarWithContent user={user}>
                <Container fluid className="bg-light h-100">
                    <Row>
                        <Col><h1 className="display-1 fs-1 text-center text-success mt-3">Success!</h1></Col>
                    </Row>
                    <Row>
                        <Col><p className="text-center mt-3">We've received your application! We'll contact you soon!</p></Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <Link to="/"><Button variant="success">Return Home</Button></Link>
                        </Col>
                    </Row>
                </Container>
            </SidebarWithContent>
        )
    }

    if (loading) {
        return (
            <SidebarWithContent user={user}>
                <Container fluid className="bg-light h-100">
                    <Row className="py-5">
                        <Col className="text-center">
                            <Spinner animation="border" variant="secondary" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1 className="display-1 fs-1 fw-light text-center">Please Wait</h1>
                        </Col>
                    </Row>
                </Container>
            </SidebarWithContent>
        )
    }

    return (
        <SidebarWithContent user={user}>
            <Container fluid className="bg-light h-100">
                <Modal show={!!error} onHide={() => setError(null)}>
                    <Modal.Header closeButton>
                        Whoops!
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            { error?.map(x => { return <li key={x}>{x}</li> })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <p className="d-flex justify-content-end">
                            <Button variant="danger" onClick={() => setError(null)}>Close</Button>
                        </p>
                    </Modal.Footer>
                </Modal>
                <Row>
                    <Col><h1 className="display-1 fs-1 text-center mt-3">Sponsorship Form</h1></Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Name of Sponsor</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input value={data.SponsorName} onChange={(e) => setData({ ...data, SponsorName: e.target.value })} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Sponsored Applicant</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input value={data.ApplicantName} onChange={(e) => setData({ ...data, ApplicantName: e.target.value })} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Address</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input value={data.Address1} onChange={(e) => setData({ ...data, Address1: e.target.value })} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={0} sm={3} />
                    <Col xs={12} sm={9}>
                        <input value={data.Address2} onChange={(e) => setData({ ...data, Address2: e.target.value })} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">City, State, Zip</p>
                    </Col>
                    <Col xs={12} sm={3}>
                        <input value={data.City} onChange={(e) => setData({ ...data, City: e.target.value })} className="form-control" />
                    </Col>
                    <Col xs={12} sm={3}>
                        <select value={data.State} onChange={(e) => setData({ ...data, State: e.target.value })} className="form-control mt-3 mt-sm-0">
                            <option value="" hidden />
                            { States.map(renderStateOption) }
                        </select>
                    </Col>
                    <Col xs={12} sm={3}>
                        <input value={data.Zip} onChange={(e) => setData({ ...data, Zip: e.target.value })} className="form-control mt-3 mt-sm-0" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Phone</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input value={data.Phone} onChange={handlePhoneChange} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Spouse</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input value={data.Spouse} onChange={(e) => setData({ ...data, Spouse: e.target.value })} className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Children</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <input className="form-control" />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Have you ever been convicted of a felony drug charge?</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <select value={(data.Drugs + "") || ''} onChange={(e) => setData({ ...data, Drugs: e.target.value === "true" })} className="form-control">
                            <option value='' hidden />
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Are you required to register as a sex offender?</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <select value={(data.SexOffender + "") || ''} onChange={(e) => setData({ ...data, SexOffender: e.target.value === "true" })} className="form-control">
                            <option value='' hidden />
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} sm={3}>
                        <p className="text-center">Reasons for wanting to become a member</p>
                    </Col>
                    <Col xs={12} sm={9}>
                        <textarea value={data.Reasons} onChange={e => setData({ ...data, Reasons: e.target.value })} className="form-control" style={{ height: "10vh"}}></textarea>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <p>Section 4 Rights of Members</p>
                        <p>(d) After five (5) continuous years of paying dues, DESCENDANT REGULAR and SPONSORED members shall be given REGULAR member status.</p>
                        <p>Membership will be on a probationary basis.  Dues ($100 yearly) must be paid by May 15th.  The By-Laws of the 80 Conservation Club and the rules for the grounds, practice range, lake, boats, campsites and clubhouse must be followed.</p>
                        <p>Applicants will be determined by the Board of Directors for admission and again at any time later to continue membership.</p>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col className="text-center">
                        <Button variant="success" className="w-50" onClick={handleSubmit}>Submit</Button>
                    </Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default SponsorshipForm