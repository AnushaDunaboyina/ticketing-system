from flask import Flask, jsonify, request, abort
from controllers import user_controller as uc
from controllers import ticket_controller as tc

app = Flask(__name__)

@app.route('/users', methods=['GET'])
def list_users():
    return jsonify([user.__dict__ for user in uc.get_all()])

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = uc.get(user_id)
    if not user:
        abort(404, 'User not found')
    return jsonify(user.__dict__)

@app.route('/users', methods=['POST'])
def create_user():
    req = request.get_json(force=True)
    name = req.get('name', '')
    email = req.get('email', '')
    role = req.get('role', 'user')
    user = uc.create(name=name, email=email, role=role)
    return jsonify(user.__dict__), 201

@app.route('/users/<int:user_id>', methods=['PUT', 'PATCH'])
def update_user(user_id):
    user = uc.get(user_id)
    if not user:
        abort(404, 'User not found')
    req = request.get_json(force=True)
    updated = uc.update(
        user_id,
        name=req.get('name'),
        email=req.get('email'),
        role=req.get('role'),
    )
    return jsonify(updated.__dict__)

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    success = uc.delete(user_id)
    if not success:
        abort(404, 'User not found')
    return '', 204


########################################

@app.route('/tickets', methods=['GET'])
def list_tickets():
    return jsonify([ticket.__dict__ for ticket in tc.get_all()])

@app.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = tc.get(ticket_id)
    if not ticket:
        abort(404, 'Ticket not found')
    return jsonify(ticket.__dict__)

@app.route('/tickets', methods=['POST'])
def create_ticket():
    req = request.get_json(force=True)
    assignee = req.get('assignee')
    reporter = req.get('reporter')
    title = req.get('title', '')
    description = req.get('description', '')
    priority = req.get('priority', 1)
    status = req.get('status', 'Open')
    ticket = tc.create(
        assignee=assignee,
        reporter=reporter,
        title=title,
        description=description,
        priority=priority,
        status=status,
    )
    return jsonify(ticket.__dict__), 201

@app.route('/tickets/<int:ticket_id>', methods=['PUT', 'PATCH'])
def update_ticket(ticket_id):
    ticket = tc.get(ticket_id)
    if not ticket:
        abort(404, 'Ticket not found')
    req = request.get_json(force=True)
    updated = tc.update(
        ticket_id,
        assignee=req.get('assignee'),
        reporter=req.get('reporter'),
        title=req.get('title'),
        description=req.get('description'),
        priority=req.get('priority'),
        status=req.get('status'),
    )
    return jsonify(updated.__dict__)

@app.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    success = tc.delete(ticket_id)
    if not success:
        abort(404, 'Ticket not found')
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
