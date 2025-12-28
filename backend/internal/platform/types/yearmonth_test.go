package types

import (
	"testing"
)

func TestNewYearMonth(t *testing.T) {
	ym, err := New(2023, 10)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if ym.Year != 2023 || ym.Month != 10 {
		t.Errorf("Expected 2023-10, got %d-%d", ym.Year, ym.Month)
	}

	_, err = New(1999, 10)
	if err == nil {
		t.Error("Expected error for year < 2000")
	}

	_, err = New(2023, 13)
	if err == nil {
		t.Error("Expected error for month > 12")
	}
}

func TestAddMonths(t *testing.T) {
	tests := []struct {
		name     string
		start    *YearMonth
		add      int
		expected *YearMonth
	}{
		{"Add within year", &YearMonth{2023, 1}, 5, &YearMonth{2023, 6}},
		{"Add wrap year", &YearMonth{2023, 10}, 3, &YearMonth{2024, 1}},
		{"Add multiple years", &YearMonth{2023, 1}, 25, &YearMonth{2025, 2}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := AddMonths(tt.start, tt.add)
			if result.Year != tt.expected.Year || result.Month != tt.expected.Month {
				t.Errorf("Expected %d-%d, got %d-%d", tt.expected.Year, tt.expected.Month, result.Year, result.Month)
			}
		})
	}
}

func TestCompare(t *testing.T) {
	ym1 := &YearMonth{2023, 10}
	ym2 := &YearMonth{2023, 11}
	ym3 := &YearMonth{2024, 1}
	ym4 := &YearMonth{2023, 10}

	if compare(ym1, ym2) >= 0 {
		t.Error("Expected ym1 < ym2")
	}
	if compare(ym2, ym1) <= 0 {
		t.Error("Expected ym2 > ym1")
	}
	if compare(ym1, ym3) >= 0 {
		t.Error("Expected ym1 < ym3")
	}
	if compare(ym1, ym4) != 0 {
		t.Error("Expected ym1 == ym4")
	}
}

func TestIsRelevant(t *testing.T) {
	current := &YearMonth{2023, 6}
	from := &YearMonth{2023, 1}
	to := &YearMonth{2023, 12}

	if !IsRelevant(current, from, to) {
		t.Error("Expected relevant")
	}

	if !IsRelevant(current, nil, to) {
		t.Error("Expected relevant (nil from)")
	}

	if !IsRelevant(current, from, nil) {
		t.Error("Expected relevant (nil to)")
	}

	past := &YearMonth{2022, 12}
	if IsRelevant(past, from, to) {
		t.Error("Expected not relevant (past)")
	}

	future := &YearMonth{2024, 1}
	if IsRelevant(future, from, to) {
		t.Error("Expected not relevant (future)")
	}
}

func TestScan(t *testing.T) {
	ym := &YearMonth{}
	err := ym.Scan("2023 10")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if ym.Year != 2023 || ym.Month != 10 {
		t.Errorf("Expected 2023-10, got %d-%d", ym.Year, ym.Month)
	}

	err = ym.Scan("")
	if err != nil {
		t.Error("Expected no error for empty string")
	}
}

func TestValue(t *testing.T) {
	ym := &YearMonth{2023, 10}
	val, err := ym.Value()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if val != "2023 10" {
		t.Errorf("Expected '2023 10', got '%v'", val)
	}

	ym = nil
	val, err = ym.Value()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if val != nil {
		t.Error("Expected nil value for nil YearMonth")
	}
}
