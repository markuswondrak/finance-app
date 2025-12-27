package storage

import (
	"errors"
	"sort"
	"wondee/finance-app-backend/internal/models"

	"gorm.io/gorm"
)

// MockRepository implements Repository for testing
type MockRepository struct {
	FixedCosts     []models.FixedCost
	SpecialCosts   []models.SpecialCost
	Users          []models.User
	WealthProfiles []models.WealthProfile
	Workspaces     []models.Workspace
	Invites        []models.Invite
	nextWorkspaceID uint
	nextInviteID    uint
}

func (m *MockRepository) CreateWorkspace(workspace *models.Workspace) error {
	if workspace.ID == 0 {
		m.nextWorkspaceID++
		workspace.ID = m.nextWorkspaceID
	}
	m.Workspaces = append(m.Workspaces, *workspace)
	return nil
}

func (m *MockRepository) GetWorkspaceByID(id uint) (*models.Workspace, error) {
	for _, w := range m.Workspaces {
		if w.ID == id {
			return &w, nil
		}
	}
	return nil, errors.New("workspace not found")
}

func (m *MockRepository) UpdateWorkspace(workspace *models.Workspace) error {
	for i, w := range m.Workspaces {
		if w.ID == workspace.ID {
			m.Workspaces[i] = *workspace
			return nil
		}
	}
	return errors.New("workspace not found")
}

func (m *MockRepository) CreateInvite(invite *models.Invite) error {
	if invite.ID == 0 {
		m.nextInviteID++
		invite.ID = m.nextInviteID
	}
	m.Invites = append(m.Invites, *invite)
	return nil
}

func (m *MockRepository) GetInviteByToken(token string) (*models.Invite, error) {
	for _, i := range m.Invites {
		if i.Token == token && !i.IsUsed {
			return &i, nil
		}
	}
	return nil, errors.New("invite not found or used")
}

func (m *MockRepository) UpdateInvite(invite *models.Invite) error {
	for i, inv := range m.Invites {
		if inv.ID == invite.ID {
			m.Invites[i] = *invite
			return nil
		}
	}
	return errors.New("invite not found")
}

func (m *MockRepository) DeleteInvite(token string) error {
	var newInvites []models.Invite
	found := false
	for _, i := range m.Invites {
		if i.Token == token {
			found = true
			continue
		}
		newInvites = append(newInvites, i)
	}
	if !found {
		return errors.New("invite not found")
	}
	m.Invites = newInvites
	return nil
}

func (m *MockRepository) LoadFixedCosts(workspaceID uint) *[]models.FixedCost {
	var filtered []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.WorkspaceID == workspaceID {
			filtered = append(filtered, c)
		}
	}

	sort.Slice(filtered, func(i, j int) bool {
		isIncomeI := filtered[i].Amount >= 0
		isIncomeJ := filtered[j].Amount >= 0

		if isIncomeI != isIncomeJ {
			return isIncomeI
		}

		return filtered[i].Name < filtered[j].Name
	})

	return &filtered
}

func (m *MockRepository) LoadFixedCostsByUser(userID uint) *[]models.FixedCost {
	var filtered []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.UserID == userID {
			filtered = append(filtered, c)
		}
	}
	return &filtered
}

func (m *MockRepository) SaveFixedObject(cost *models.FixedCost) {
	found := false
	for i, c := range m.FixedCosts {
		if c.ID == cost.ID && cost.ID != 0 {
			m.FixedCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		if cost.ID == 0 {
			cost.ID = len(m.FixedCosts) + 1
		}
		m.FixedCosts = append(m.FixedCosts, *cost)
	}
}

func (m *MockRepository) DeleteFixedCost(id int, workspaceID uint) {
	var newCosts []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.ID != id || c.WorkspaceID != workspaceID {
			newCosts = append(newCosts, c)
		}
	}
	m.FixedCosts = newCosts
}

func (m *MockRepository) LoadSpecialCosts(workspaceID uint) *[]models.SpecialCost {
	var filtered []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.WorkspaceID == workspaceID {
			filtered = append(filtered, c)
		}
	}

	sort.Slice(filtered, func(i, j int) bool {
		d1 := filtered[i].DueDate
		d2 := filtered[j].DueDate

		if d1 == nil {
			return true
		}
		if d2 == nil {
			return false
		}

		if d1.Year != d2.Year {
			return d1.Year < d2.Year
		}
		return d1.Month < d2.Month
	})

	return &filtered
}

func (m *MockRepository) LoadSpecialCostsByUser(userID uint) *[]models.SpecialCost {
	var filtered []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.UserID == userID {
			filtered = append(filtered, c)
		}
	}
	return &filtered
}

func (m *MockRepository) SaveSpecialCost(cost *models.SpecialCost) {
	found := false
	for i, c := range m.SpecialCosts {
		if c.ID == cost.ID && cost.ID != 0 {
			m.SpecialCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		if cost.ID == 0 {
			cost.ID = len(m.SpecialCosts) + 1
		}
		m.SpecialCosts = append(m.SpecialCosts, *cost)
	}
}

func (m *MockRepository) DeleteSpecialCost(id int, workspaceID uint) {
	var newCosts []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.ID != id || c.WorkspaceID != workspaceID {
			newCosts = append(newCosts, c)
		}
	}
	m.SpecialCosts = newCosts
}

func (m *MockRepository) PurgeUserData(userID uint) error {
	var newFixed []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.UserID != userID {
			newFixed = append(newFixed, c)
		}
	}
	m.FixedCosts = newFixed

	var newSpecial []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.UserID != userID {
			newSpecial = append(newSpecial, c)
		}
	}
	m.SpecialCosts = newSpecial

	var newProfiles []models.WealthProfile
	for _, p := range m.WealthProfiles {
		if p.UserID != userID {
			newProfiles = append(newProfiles, p)
		}
	}
	m.WealthProfiles = newProfiles

	return nil
}

func (m *MockRepository) GetUser() (*models.User, error) {
	if len(m.Users) > 0 {
		return &m.Users[0], nil
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) UpdateUserCurrentAmount(amount int) error {
	if len(m.Users) > 0 {
		m.Users[0].CurrentAmount = amount
		return nil
	}
	return errors.New("user not found")
}

func (m *MockRepository) Create(user *models.User) error {
	user.ID = uint(len(m.Users) + 1)
	m.Users = append(m.Users, *user)
	return nil
}

func (m *MockRepository) GetByEmail(email string) (*models.User, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) GetByID(id uint) (*models.User, error) {
	for _, u := range m.Users {
		if u.ID == id {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) Update(user *models.User) error {
	for i, u := range m.Users {
		if u.ID == user.ID {
			m.Users[i] = *user
			return nil
		}
	}
	return nil
}

func (m *MockRepository) Delete(id uint) error {
	var newUsers []models.User
	found := false
	for _, u := range m.Users {
		if u.ID != id {
			newUsers = append(newUsers, u)
		} else {
			found = true
		}
	}
	if !found {
		return errors.New("user not found")
	}
	m.Users = newUsers

	// Clean up related data in mock
	var newFixed []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.UserID != id {
			newFixed = append(newFixed, c)
		}
	}
	m.FixedCosts = newFixed

	var newSpecial []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.UserID != id {
			newSpecial = append(newSpecial, c)
		}
	}
	m.SpecialCosts = newSpecial

	var newProfiles []models.WealthProfile
	for _, p := range m.WealthProfiles {
		if p.UserID != id {
			newProfiles = append(newProfiles, p)
		}
	}
	m.WealthProfiles = newProfiles

	return nil
}

func (m *MockRepository) GetWealthProfile(workspaceID uint) (*models.WealthProfile, error) {
	for _, p := range m.WealthProfiles {
		if p.WorkspaceID == workspaceID {
			return &p, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (m *MockRepository) UpsertWealthProfile(profile *models.WealthProfile) error {
	found := false
	for i, p := range m.WealthProfiles {
		if p.WorkspaceID == profile.WorkspaceID {
			m.WealthProfiles[i] = *profile
			found = true
			break
		}
	}
	if !found {
		if profile.ID == 0 {
			profile.ID = uint(len(m.WealthProfiles) + 1)
		}
		m.WealthProfiles = append(m.WealthProfiles, *profile)
	}
	return nil
}
