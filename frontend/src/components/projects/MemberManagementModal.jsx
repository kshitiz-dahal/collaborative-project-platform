import { useState } from "react";

const MemberManagementModal = ({
    project,
    onClose,
    onAddMember,
    onRemoveMember,
    addingMember,
    removingMemberId,
    error,
}) => {
    const [email, setEmail] = useState("");

    if (!project) return null;

    const handleAdd = async (event) => {
        event.preventDefault();

        if (!email.trim()) return;

        const success = await onAddMember(email.trim());

        if (success) {
            setEmail("");
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="member-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="member-modal-header">
                    <div>
                        <span className="member-modal-label">
                            PROJECT MEMBERS
                        </span>

                        <h2>Manage Members</h2>

                        <p>
                            {project.members?.length || 0}{" "}
                            members in this project
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form
                    className="add-member-form"
                    onSubmit={handleAdd}
                >
                    <div className="add-member-input">
                        <input
                            type="email"
                            placeholder="Enter member email..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={addingMember}
                        >
                            {addingMember
                                ? "Adding..."
                                : "+ Add Member"}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="member-list">
                    {project.members?.map((member) => {
                        const isOwner =
                            project.owner?._id ===
                            member._id;

                        return (
                            <div
                                className="member-list-item"
                                key={member._id}
                            >
                                <div className="member-list-user">
                                    <div className="member-list-avatar">
                                        {member.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {member.name}
                                        </strong>

                                        <span>
                                            {member.email}
                                        </span>
                                    </div>
                                </div>

                                <div className="member-actions">
                                    {isOwner ? (
                                        <span className="owner-badge">
                                            Owner
                                        </span>
                                    ) : (
                                        <>
                                            <span className="member-badge">
                                                Member
                                            </span>

                                            <button
                                                type="button"
                                                className="remove-member-button"
                                                onClick={() =>
                                                    onRemoveMember(
                                                        member._id
                                                    )
                                                }
                                                disabled={
                                                    removingMemberId ===
                                                    member._id
                                                }
                                            >
                                                {removingMemberId ===
                                                member._id
                                                    ? "Removing..."
                                                    : "Remove"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="member-modal-footer">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberManagementModal;